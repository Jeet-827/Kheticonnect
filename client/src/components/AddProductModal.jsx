import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { 
  X, 
  Sprout, 
  Check, 
  UploadCloud, 
  Image as ImageIcon, 
  Loader2, 
  Sparkles, 
  RefreshCw, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { setUI, showToast } from '../store/slices/uiSlice';
import { addProduct } from '../store/slices/marketplaceSlice';

const PRESETS = [
  { label: 'Wheat',    url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=800&auto=format&fit=crop' },
  { label: 'Tomatoes', url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=800&auto=format&fit=crop' },
  { label: 'Rice',     url: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=800&auto=format&fit=crop' },
  { label: 'Mango',    url: 'https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=800&auto=format&fit=crop' },
  { label: 'Potato',   url: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=800&auto=format&fit=crop' },
  { label: 'Cotton',   url: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?q=80&w=800&auto=format&fit=crop' },
];

const INITIAL_FORM = {
  title: '',
  category: 'Grains',
  unit: 'Quintal',
  availableQuantity: 50,
  minOrderQuantity: 1,
  pricePerUnit: 2200,
  listingType: 'fixed',
  isOrganic: true,
  harvestDate: new Date().toISOString().split('T')[0],
  description: '',
  image: PRESETS[0].url,
};

export const UNIT_LIMITS = {
  Kg: { max: 5000, label: '₹5,000 / Kg' },
  Quintal: { max: 50000, label: '₹50,000 / Quintal' },
  Ton: { max: 500000, label: '₹5,00,000 / Ton' },
  Box: { max: 25000, label: '₹25,000 / Box' }
};

export default function AddProductModal() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.ui.isAddModalOpen);
  const [form, setForm] = useState(INITIAL_FORM);
  
  // ImageKit upload states
  const [imageTab, setImageTab] = useState('upload'); // 'upload' | 'presets' | 'url'
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(null);
  const [uploadError, setUploadError] = useState('');
  const [previewUrl, setPreviewUrl] = useState(PRESETS[0].url);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const set = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleClose = () => {
    setForm(INITIAL_FORM);
    setPreviewUrl(PRESETS[0].url);
    setUploadSuccess(null);
    setUploadError('');
    dispatch(setUI({ isAddModalOpen: false }));
  };

  // Handle Crop Image Selection & ImageKit Upload
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPEG, PNG, WEBP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Image size should be less than 10MB.');
      return;
    }

    setUploadError('');
    setUploading(true);
    setUploadSuccess(null);

    // Read image as base64 for upload
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result;
      setPreviewUrl(base64Data);

      try {
        const { data } = await axios.post('/api/imagekit/upload', {
          file: base64Data,
          fileName: `crop_${Date.now()}_${file.name.replace(/\s+/g, '_')}`,
          folder: '/crops',
          tags: ['kheticonnect', form.category || 'crops']
        });

        if (data.success && data.url) {
          set('image', data.url);
          setPreviewUrl(data.url);
          setUploadSuccess({
            source: data.source || 'imagekit',
            url: data.url,
            name: file.name
          });
          dispatch(showToast({ message: 'Crop image uploaded to ImageKit CDN!', type: 'success' }));
        } else {
          throw new Error(data.message || 'Image upload failed');
        }
      } catch (err) {
        console.error('ImageKit upload error:', err);
        // Fallback: keep the local preview as form image so listing can still proceed
        set('image', base64Data);
        setUploadError(err.response?.data?.message || err.message || 'ImageKit upload failed');
      } finally {
        setUploading(false);
      }
    };

    reader.onerror = () => {
      setUploading(false);
      setUploadError('Failed to read the selected file.');
    };

    reader.readAsDataURL(file);
  };

  const handlePresetSelect = (url) => {
    set('image', url);
    setPreviewUrl(url);
    setUploadSuccess(null);
    setUploadError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isAuction = form.listingType === 'auction';

    const maxLimit = UNIT_LIMITS[form.unit]?.max || 500000;
    const price = Number(form.pricePerUnit);
    if (price > maxLimit) {
      dispatch(showToast({
        message: `Price cannot exceed ₹${maxLimit.toLocaleString('en-IN')} for ${form.unit}. Please enter a realistic market rate.`,
        type: 'error'
      }));
      return;
    }

    try {
      await dispatch(addProduct({
        ...form,
        availableQuantity: Number(form.availableQuantity),
        minOrderQuantity: Number(form.minOrderQuantity),
        pricePerUnit: Number(form.pricePerUnit),
        ...(isAuction && {
          currentHighestBid: Number(form.pricePerUnit),
          minBidIncrement: 50,
          auctionEndsAt: new Date(Date.now() + 5 * 86400000).toISOString(),
        }),
      })).unwrap();

      dispatch(showToast({ message: 'Produce listing created successfully with crop image!', type: 'success' }));
      handleClose();
    } catch (err) {
      dispatch(showToast({ message: err.message || 'Failed to add product', type: 'error' }));
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-card max-w-xl max-h-[92vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-800 p-5 rounded-t-2xl flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Sprout className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">List New Produce</h3>
              <p className="text-emerald-200 text-xs">Upload crop photos to ImageKit & reach buyers directly</p>
            </div>
          </div>
          <button onClick={handleClose} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Crop / Produce Name *</label>
            <input
              required
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="e.g. Organic Punjab Sharbati Wheat Grade A"
              className="form-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
              <select value={form.category} onChange={(e) => set('category', e.target.value)} className="form-input">
                {['Grains', 'Vegetables', 'Fruits', 'Pulses', 'Cash Crops', 'Spices'].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Unit</label>
              <select value={form.unit} onChange={(e) => set('unit', e.target.value)} className="form-input">
                {['Quintal', 'Kg', 'Ton', 'Box'].map((u) => (
                  <option key={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Total Quantity</label>
              <input
                type="number"
                min="1"
                required
                value={form.availableQuantity}
                onChange={(e) => set('availableQuantity', e.target.value)}
                className="form-input"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Min. Order</label>
              <input
                type="number"
                min="1"
                required
                value={form.minOrderQuantity}
                onChange={(e) => set('minOrderQuantity', e.target.value)}
                className="form-input"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">Price (₹/{form.unit})</label>
                <span className="text-[10px] text-emerald-800 font-extrabold bg-emerald-100/70 px-1.5 py-0.5 rounded">
                  Max ₹{(UNIT_LIMITS[form.unit]?.max || 500000).toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="number"
                min="1"
                max={UNIT_LIMITS[form.unit]?.max || 500000}
                required
                value={form.pricePerUnit}
                onChange={(e) => set('pricePerUnit', e.target.value)}
                className={`form-input ${Number(form.pricePerUnit) > (UNIT_LIMITS[form.unit]?.max || 500000) ? 'border-red-500 bg-red-50/60 focus:border-red-500' : ''}`}
              />
            </div>
          </div>

          {Number(form.pricePerUnit) > (UNIT_LIMITS[form.unit]?.max || 500000) && (
            <div className="text-[11px] font-bold text-red-700 bg-red-50 border border-red-200 rounded-xl p-2.5 flex items-center gap-2">
              <span className="text-sm">⚠️</span>
              <span>
                Price cannot exceed ₹{(UNIT_LIMITS[form.unit]?.max || 500000).toLocaleString('en-IN')} per {form.unit}. Please enter a realistic market price.
              </span>
            </div>
          )}

          {/* Listing type + organic */}
          <div className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex-1">
              <label className="text-xs font-bold text-slate-700 block mb-2">Selling Model</label>
              <div className="flex gap-2">
                {[
                  ['fixed', 'Fixed Price', 'bg-emerald-600 border-emerald-600'],
                  ['auction', 'Auction', 'bg-amber-600 border-amber-600'],
                ].map(([type, label, active]) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => set('listingType', type)}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      form.listingType === type ? `${active} text-white` : 'bg-white border-slate-200 text-slate-600'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col justify-end">
              <label className="flex items-center gap-2 cursor-pointer pb-2">
                <input
                  type="checkbox"
                  checked={form.isOrganic}
                  onChange={(e) => set('isOrganic', e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-xs font-bold text-slate-700">Organic</span>
              </label>
            </div>
          </div>

          {/* ── ImageKit Crop Image Upload Section ── */}
          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/70 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-emerald-600" /> Crop Photo (ImageKit Integration)
                </label>
                <p className="text-[11px] text-slate-500">Upload your harvest photo directly to ImageKit CDN</p>
              </div>

              {/* Mode switch */}
              <div className="flex bg-slate-200/80 p-0.5 rounded-lg text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => setImageTab('upload')}
                  className={`px-2 py-1 rounded-md transition-all ${imageTab === 'upload' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600'}`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setImageTab('presets')}
                  className={`px-2 py-1 rounded-md transition-all ${imageTab === 'presets' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600'}`}
                >
                  Presets
                </button>
                <button
                  type="button"
                  onClick={() => setImageTab('url')}
                  className={`px-2 py-1 rounded-md transition-all ${imageTab === 'url' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600'}`}
                >
                  URL
                </button>
              </div>
            </div>

            {/* Tab 1: ImageKit File Upload */}
            {imageTab === 'upload' && (
              <div className="space-y-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                    uploading
                      ? 'border-emerald-400 bg-emerald-50/40'
                      : 'border-slate-300 hover:border-emerald-500 bg-white hover:bg-emerald-50/20'
                  }`}
                >
                  {uploading ? (
                    <div className="py-2 flex flex-col items-center justify-center">
                      <Loader2 className="w-8 h-8 text-emerald-600 animate-spin mb-1" />
                      <p className="text-xs font-bold text-emerald-800">Uploading crop photo to ImageKit...</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Optimizing & generating CDN endpoints</p>
                    </div>
                  ) : (
                    <div className="py-2 flex flex-col items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-2">
                        <UploadCloud className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-bold text-slate-800">
                        Click to select crop photo or drag and drop
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        PNG, JPG or WEBP up to 10MB • Fast ImageKit CDN delivery
                      </p>
                    </div>
                  )}
                </div>

                {uploadError && (
                  <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl p-2.5 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{uploadError} (Local image preview retained for listing)</span>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Presets */}
            {imageTab === 'presets' && (
              <div className="grid grid-cols-6 gap-2 pt-1">
                {PRESETS.map(({ label, url }) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => handlePresetSelect(url)}
                    className={`relative h-14 rounded-xl overflow-hidden border-2 transition-all ${
                      form.image === url ? 'border-emerald-600 ring-2 ring-emerald-200' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt={label} className="w-full h-full object-cover" />
                    <span className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[8px] text-center">{label}</span>
                    {form.image === url && (
                      <div className="absolute top-1 right-1 w-4 h-4 bg-emerald-600 rounded-full flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Tab 3: Custom URL */}
            {imageTab === 'url' && (
              <div className="pt-1">
                <input
                  type="url"
                  placeholder="https://ik.imagekit.io/... or https://..."
                  value={form.image}
                  onChange={(e) => {
                    set('image', e.target.value);
                    setPreviewUrl(e.target.value);
                  }}
                  className="form-input text-xs"
                />
              </div>
            )}

            {/* Current Active Preview & ImageKit status */}
            {previewUrl && (
              <div className="flex items-center gap-3 p-2 bg-white rounded-xl border border-slate-200">
                <img
                  src={previewUrl}
                  alt="Crop Preview"
                  className="w-14 h-14 rounded-lg object-cover border border-slate-200 shrink-0"
                  onError={(e) => {
                    e.currentTarget.src = PRESETS[0].url;
                  }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <Sparkles className="w-2.5 h-2.5" /> ImageKit Active
                    </span>
                    {uploadSuccess?.source === 'imagekit' && (
                      <span className="text-[9px] text-slate-400 truncate">CDN Hosted</span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-slate-700 truncate mt-1">
                    {uploadSuccess?.name || form.title || 'Selected Crop Photo'}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {form.image.startsWith('data:') ? 'Base64 image stream' : form.image}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 p-2 hover:bg-emerald-50 rounded-lg transition-colors"
                  title="Change image"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Description</label>
            <textarea
              rows="2"
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Moisture content, grading, packaging details..."
              className="form-input"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={handleClose} className="btn btn-outline flex-1">
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading || Number(form.pricePerUnit) > (UNIT_LIMITS[form.unit]?.max || 500000)}
              className="btn bg-emerald-600 hover:bg-emerald-700 text-white flex-1 font-bold disabled:opacity-50"
            >
              {uploading ? 'Uploading Photo...' : 'Publish Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}