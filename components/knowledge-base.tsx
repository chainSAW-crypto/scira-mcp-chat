"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, Trash2, File, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { type KnowledgeBase } from "@/lib/db/schema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface KnowledgeBaseProps {
  projectId: string;
  knowledge: KnowledgeBase[];
  onKnowledgeUpdate: () => void;
}

export function KnowledgeBase({ projectId, knowledge, onKnowledgeUpdate }: KnowledgeBaseProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<KnowledgeBase | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (files: FileList) => {
    setIsUploading(true);
    
    for (const file of Array.from(files)) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('projectId', projectId);

        const response = await fetch('/api/knowledge', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          toast.success(`${file.name} uploaded successfully`);
        } else {
          toast.error(`Failed to upload ${file.name}`);
        }
      } catch (error) {
        console.error('Upload error:', error);
        toast.error(`Error uploading ${file.name}`);
      }
    }
    
    setIsUploading(false);
    onKnowledgeUpdate();
  };

  const deleteKnowledge = async (id: string) => {
    try {
      const response = await fetch(`/api/knowledge/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('File deleted successfully');
        onKnowledgeUpdate();
      } else {
        toast.error('Failed to delete file');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Error deleting file');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Project Knowledge
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".txt,.md,.pdf,.doc,.docx"
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              {isUploading ? 'Uploading...' : 'Upload Files'}
            </Button>
          </div>

          <div className="space-y-2">
            {knowledge.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No files uploaded yet
              </p>
            ) : (
              knowledge.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <File className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{item.fileName}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.fileType} • {formatFileSize(
                          (item.metadata as any)?.size || 0
                        )}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem 
                        onClick={() => setItemToDelete(item)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete File
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete File</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete &ldquo;{itemToDelete?.fileName}&rdquo;? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setItemToDelete(null)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => {
                  if (itemToDelete) {
                    deleteKnowledge(itemToDelete.id);
                    setItemToDelete(null);
                  }
                }}
              >
                Delete File
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
