
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Camera, FileUp, X, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BillUploadSectionProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
}

export const BillUploadSection = ({ files, onFilesChange }: BillUploadSectionProps) => {
  const { toast } = useToast();
  const [dragOver, setDragOver] = useState(false);

  const handleFileUpload = (newFiles: FileList | null) => {
    if (!newFiles) return;

    const validFiles = Array.from(newFiles).filter(file => {
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      const maxSize = 10 * 1024 * 1024; // 10MB
      
      if (!validTypes.includes(file.type)) {
        toast({
          title: "Invalid File Type",
          description: "Only JPG, PNG, and PDF files are allowed",
          variant: "destructive"
        });
        return false;
      }
      
      if (file.size > maxSize) {
        toast({
          title: "File Too Large",
          description: "File size must be less than 10MB",
          variant: "destructive"
        });
        return false;
      }
      
      return true;
    });

    onFilesChange([...files, ...validFiles]);
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="space-y-4">
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => document.getElementById('camera-input')?.click()}>
              <Camera className="h-4 w-4 mr-2" />
              Take Photo
            </Button>
            <Button variant="outline" onClick={() => document.getElementById('file-input')?.click()}>
              <FileUp className="h-4 w-4 mr-2" />
              Upload File
            </Button>
          </div>
          <p className="text-sm text-gray-600">
            or drag and drop files here
          </p>
          <p className="text-xs text-gray-500">
            Supports: JPG, PNG, PDF (Max 10MB each)
          </p>
        </div>
      </div>

      {/* Hidden Inputs */}
      <input
        id="camera-input"
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFileUpload(e.target.files)}
      />
      <input
        id="file-input"
        type="file"
        accept=".jpg,.jpeg,.png,.pdf"
        multiple
        className="hidden"
        onChange={(e) => handleFileUpload(e.target.files)}
      />

      {/* File Previews */}
      {files.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {files.map((file, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {file.type.startsWith('image/') ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt="Preview"
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-red-100 rounded flex items-center justify-center">
                        <span className="text-red-600 font-bold text-xs">PDF</span>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => removeFile(index)}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="mt-2 flex gap-2">
                <Badge variant="secondary" className="text-xs">Original Bill</Badge>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
