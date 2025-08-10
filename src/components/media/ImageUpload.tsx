import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Image as ImageIcon, Trash2 } from "lucide-react";
import { uploadFile, validateImageFile, deleteFile } from "@/lib/supabase";

interface ImageUploadProps {
  onImageUploaded: (data: {
    url: string;
    altText: string;
    caption?: string;
    credit?: string;
  }) => void;
  onRemove: () => void;
  initialData?: {
    url?: string;
    altText?: string;
    caption?: string;
    credit?: string;
  };
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onImageUploaded, 
  onRemove, 
  initialData 
}) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  
  const [imageData, setImageData] = useState({
    url: initialData?.url || '',
    altText: initialData?.altText || '',
    caption: initialData?.caption || '',
    credit: initialData?.credit || ''
  });

  const handleFileSelect = async (file: File) => {
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      toast({
        title: "Invalid file",
        description: validation.error,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const { url, error } = await uploadFile(file, 'images', (progress) => {
        setUploadProgress(progress);
      });

      if (error) {
        throw new Error(error);
      }

      const newImageData = {
        ...imageData,
        url
      };
      
      setImageData(newImageData);
      
      if (newImageData.altText) {
        onImageUploaded(newImageData);
      }

      toast({
        title: "Success!",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFormChange = (field: keyof typeof imageData, value: string) => {
    const newImageData = {
      ...imageData,
      [field]: value
    };
    
    setImageData(newImageData);
    
    // Only call onImageUploaded if we have both URL and alt text
    if (newImageData.url && newImageData.altText) {
      onImageUploaded(newImageData);
    }
  };

  const handleReplace = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = async () => {
    if (imageData.url) {
      await deleteFile(imageData.url, 'images');
    }
    onRemove();
  };

  return (
    <div className="space-y-4 border-2 border-dashed border-muted rounded-lg p-4">
      <div className="flex justify-between items-center">
        <Label className="text-base font-medium">Image Upload</Label>
        <Button
          type="button"
          onClick={handleRemove}
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
        >
          <Trash2 size={16} />
        </Button>
      </div>

      {!imageData.url ? (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragOver
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-muted-foreground/50'
          }`}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
        >
          <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Drag and drop an image here, or click to browse
            </p>
            <p className="text-xs text-muted-foreground">
              PNG, JPG, JPEG, WEBP up to 10MB
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="mt-2"
            >
              <Upload className="w-4 h-4 mr-2" />
              {uploading ? 'Uploading...' : 'Browse Files'}
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpg,image/jpeg,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />

          {uploading && (
            <div className="mt-4">
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-xs text-muted-foreground mt-1">
                {uploadProgress}% uploaded
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            <img
              src={imageData.url}
              alt={imageData.altText || 'Uploaded image'}
              className="w-full max-h-48 object-cover rounded-lg border"
            />
            <div className="absolute top-2 right-2 flex gap-2">
              <Button
                type="button"
                onClick={handleReplace}
                variant="secondary"
                size="sm"
                className="h-8 px-2"
              >
                Replace
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor="altText" className="text-sm font-medium">
                Alt Text <span className="text-destructive">*</span>
              </Label>
              <Input
                id="altText"
                value={imageData.altText}
                onChange={(e) => handleFormChange('altText', e.target.value)}
                placeholder="Describe the image for accessibility"
                className="mt-1"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Required for accessibility. Describe what's in the image.
              </p>
            </div>

            <div>
              <Label htmlFor="caption" className="text-sm font-medium">
                Caption (Optional)
              </Label>
              <Input
                id="caption"
                value={imageData.caption}
                onChange={(e) => handleFormChange('caption', e.target.value)}
                placeholder="Caption text that appears below the image"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="credit" className="text-sm font-medium">
                Credit (Optional)
              </Label>
              <Input
                id="credit"
                value={imageData.credit}
                onChange={(e) => handleFormChange('credit', e.target.value)}
                placeholder="Image source or photographer credit"
                className="mt-1"
              />
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpg,image/jpeg,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;