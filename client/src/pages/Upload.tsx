import { useState } from "react";
import { useLocation } from "wouter";
import { AudioUploadForm } from "@/components/AudioUploadForm";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { AlertCircle, ArrowLeft, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Upload() {
  const [, setLocation] = useLocation();
  const { isAuthenticated, loading } = useAuth();
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedTradition, setSelectedTradition] = useState("");
  const [selectedElder, setSelectedElder] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showNewTraditionForm, setShowNewTraditionForm] = useState(false);
  const [showNewElderForm, setShowNewElderForm] = useState(false);
  const [showNewCategoryForm, setShowNewCategoryForm] = useState(false);

  // Fetch traditions
  const traditionsQuery = trpc.recordings.getTraditions.useQuery();
  const { data: traditions = [], isLoading: traditionsLoading } = traditionsQuery;

  // Fetch elders for selected tradition
  const eldersQuery = trpc.elders.list.useQuery(
    { tradition_id: selectedTradition, limit: 100, offset: 0 },
    { enabled: !!selectedTradition }
  );
  const { data: elders = [], isLoading: eldersLoading } = eldersQuery;

  // Recording categories (static for now)
  const categories = [
    { id: "cat-1", name: "Oral History" },
    { id: "cat-2", name: "Spiritual Practices" },
    { id: "cat-3", name: "Music & Chants" },
    { id: "cat-4", name: "Healing Traditions" },
    { id: "cat-5", name: "Language & Linguistics" },
    { id: "cat-6", name: "Ceremonies" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-yellow-600 mx-auto" />
          <h2 className="font-playfair text-2xl font-bold text-foreground">
            Sign In Required
          </h2>
          <p className="text-muted-foreground">
            You must be signed in to upload recordings.
          </p>
          <button
            onClick={() => setLocation("/")}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  const canProceed = selectedTradition && selectedElder && selectedCategory;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white py-12">
        <div className="container">
          <button
            onClick={() => setLocation("/")}
            className="flex items-center gap-2 text-indigo-100 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Browse
          </button>
          <h1 className="font-playfair text-4xl font-bold">Upload Recording</h1>
          <p className="text-indigo-100 text-lg mt-2">
            Share ancestral wisdom with the Ejiogbe Voices community
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container py-12">
        <div className="max-w-3xl mx-auto">
          {!showUploadForm ? (
            <div className="space-y-8">
              {/* Info section */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-4">
                <h2 className="font-playfair text-xl font-bold text-foreground">
                  Before You Upload
                </h2>
                <ul className="space-y-3 text-sm text-foreground">
                  <li className="flex gap-3">
                    <span className="text-blue-600 font-bold">1.</span>
                    <span>
                      Ensure you have proper consent from the speaker to record and share their voice
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-600 font-bold">2.</span>
                    <span>
                      Audio should be clear and in a supported format (MP3, WAV, OGG, M4A)
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-600 font-bold">3.</span>
                    <span>
                      Select the tradition, elder, and category that best fit your recording
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-600 font-bold">4.</span>
                    <span>
                      Your recording will be automatically transcribed and made available to the community
                    </span>
                  </li>
                </ul>
              </div>

              {/* Selection Form */}
              <div className="space-y-6">
                {/* Tradition Selection */}
                <div className="card">
                  <div className="card-body">
                    <h3 className="font-playfair font-bold text-lg mb-4">Select Tradition</h3>
                    
                    {traditionsLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                      </div>
                    ) : traditions.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">No traditions found</p>
                        <Button 
                          onClick={() => setShowNewTraditionForm(true)}
                          className="bg-indigo-600 hover:bg-indigo-700"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Create New Tradition
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {traditions.map((tradition: any) => (
                            <button
                              key={tradition.id}
                              onClick={() => {
                                setSelectedTradition(tradition.id);
                                setSelectedElder(""); // Reset elder when tradition changes
                              }}
                              className={`p-4 rounded-lg border-2 transition-all text-left ${
                                selectedTradition === tradition.id
                                  ? "border-indigo-600 bg-indigo-50"
                                  : "border-border hover:border-indigo-300"
                              }`}
                            >
                              <p className="font-medium text-foreground">{tradition.name}</p>
                              <p className="text-sm text-muted-foreground">{tradition.region}</p>
                            </button>
                          ))}
                        </div>
                        <Button 
                          variant="outline"
                          onClick={() => setShowNewTraditionForm(true)}
                          className="w-full"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Create New Tradition
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Elder Selection */}
                {selectedTradition && (
                  <div className="card">
                    <div className="card-body">
                      <h3 className="font-playfair font-bold text-lg mb-4">Select Elder</h3>
                      
                      {eldersLoading ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                        </div>
                      ) : elders.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground mb-4">No elders found for this tradition</p>
                          <Button 
                            onClick={() => setShowNewElderForm(true)}
                            className="bg-indigo-600 hover:bg-indigo-700"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Create New Elder
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {elders.map((elder: any) => (
                              <button
                                key={elder.id}
                                onClick={() => setSelectedElder(elder.id)}
                                className={`p-4 rounded-lg border-2 transition-all text-left ${
                                  selectedElder === elder.id
                                    ? "border-indigo-600 bg-indigo-50"
                                    : "border-border hover:border-indigo-300"
                                }`}
                              >
                                <p className="font-medium text-foreground">{elder.name}</p>
                                <p className="text-sm text-muted-foreground">{elder.lineage}</p>
                              </button>
                            ))}
                          </div>
                          <Button 
                            variant="outline"
                            onClick={() => setShowNewElderForm(true)}
                            className="w-full"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Create New Elder
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Category Selection */}
                {selectedTradition && selectedElder && (
                  <div className="card">
                    <div className="card-body">
                      <h3 className="font-playfair font-bold text-lg mb-4">Select Category</h3>
                      
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {categories.map((category) => (
                            <button
                              key={category.id}
                              onClick={() => setSelectedCategory(category.id)}
                              className={`p-4 rounded-lg border-2 transition-all text-left ${
                                selectedCategory === category.id
                                  ? "border-indigo-600 bg-indigo-50"
                                  : "border-border hover:border-indigo-300"
                              }`}
                            >
                              <p className="font-medium text-foreground">{category.name}</p>
                            </button>
                          ))}
                        </div>
                        <Button 
                          variant="outline"
                          onClick={() => setShowNewCategoryForm(true)}
                          className="w-full"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Create New Category
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Proceed Button */}
                {canProceed && (
                  <Button 
                    onClick={() => setShowUploadForm(true)}
                    className="w-full bg-gold-600 hover:bg-gold-700 text-white py-6 text-lg font-bold"
                  >
                    Proceed to Upload
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <AudioUploadForm
              traditionId={selectedTradition}
              elderId={selectedElder}
              onSuccess={() => {
                setShowUploadForm(false);
                setSelectedTradition("");
                setSelectedElder("");
                setSelectedCategory("");
              }}
              onClose={() => setShowUploadForm(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
