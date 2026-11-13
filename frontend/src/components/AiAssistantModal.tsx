import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bot,
  Sparkles,
  Mic,
  MicOff,
  Send,
  X,
  Loader2,
  CheckCircle2,
  DollarSign,
  FolderPlus,
} from "lucide-react";
import { aiApi, GeneratedJobPost, AiChatMessage } from "../api/ai";
import { projectsApi } from "../api/marketplace";
import { useAuth } from "../context/AuthContext";

export const AiAssistantModal: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "job_creator">("job_creator");

  // Chat State
  const [messages, setMessages] = useState<AiChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hello! I am your **QubeLancer AI Copilot**.\n\nDescribe your project requirement by voice or text, and I'll generate a complete, structured job post ready to publish to verified specialists!",
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Job Creator State
  const [jobPrompt, setJobPrompt] = useState("");
  const [isGeneratingJob, setIsGeneratingJob] = useState(false);
  const [generatedDraft, setGeneratedDraft] = useState<GeneratedJobPost | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Speech Recognition State
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Web Speech API if supported
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          if (activeTab === "job_creator") {
            setJobPrompt((prev) => (prev ? `${prev} ${transcript}` : transcript));
          } else {
            setInputMessage((prev) => (prev ? `${prev} ${transcript}` : transcript));
          }
        }
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, [activeTab]);

  const toggleVoice = () => {
    if (!recognitionRef.current) {
      alert("Voice recognition is not supported in this browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  };

  const handleGenerateJob = async () => {
    if (!jobPrompt.trim()) return;
    setIsGeneratingJob(true);
    setErrorMsg(null);
    setPublishSuccess(null);
    try {
      const draft = await aiApi.generateJobPost(jobPrompt);
      setGeneratedDraft(draft);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to generate job post with AI.");
    } finally {
      setIsGeneratingJob(false);
    }
  };

  const handlePublishDirectly = async () => {
    if (!generatedDraft) return;
    if (!isAuthenticated) {
      // Store in session storage and redirect to register
      sessionStorage.setItem("bitqube_pending_ai_job", JSON.stringify(generatedDraft));
      navigate("/register");
      setIsOpen(false);
      return;
    }

    setIsPublishing(true);
    setErrorMsg(null);
    try {
      const calculatedDeadline = new Date(
        Date.now() + (generatedDraft.deadline_days || 30) * 24 * 60 * 60 * 1000
      ).toISOString();

      const created = await projectsApi.create({
        title: generatedDraft.title,
        category_id: generatedDraft.category_id || "",
        description: generatedDraft.description,
        budget_min: generatedDraft.budget_min,
        budget_max: generatedDraft.budget_max,
        deadline: calculatedDeadline,
        currency_code: "USD",
      });

      setPublishSuccess("Project published successfully to the marketplace!");
      setTimeout(() => {
        setIsOpen(false);
        navigate(`/projects/${created.id}`);
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to publish project. Please ensure all details are valid.");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isChatLoading) return;

    const userMsg: AiChatMessage = { role: "user", content: inputMessage };
    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsChatLoading(true);

    try {
      const res = await aiApi.chat(userMsg.content, messages);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.reply },
      ]);
      if (res.extracted_job) {
        setGeneratedDraft(res.extracted_job);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error communicating with the AI service. Please try again.",
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <>
      {/* Floating Activator Button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 text-white font-bold text-sm shadow-xl shadow-indigo-600/35 hover:scale-105 hover:shadow-indigo-500/50 transition-all duration-200 border border-white/20 group"
        aria-label="Open AI Assistant"
      >
        <div className="relative">
          <Bot className="w-5 h-5 text-white animate-bounce" style={{ animationDuration: "2.5s" }} />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950 animate-ping" />
        </div>
        <span>AI Copilot & Voice</span>
        <Sparkles className="w-4 h-4 text-amber-300" />
      </button>

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                    QubeLancer AI Copilot
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider font-semibold">
                      Voice + Chat
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Voice & text job post generator with structured auto-fill
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mode Switch Tabs */}
            <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab("job_creator")}
                className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
                  activeTab === "job_creator"
                    ? "border-indigo-500 text-indigo-400"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <FolderPlus className="w-4 h-4" />
                Voice & Text Job Generator
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("chat")}
                className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors ${
                  activeTab === "chat"
                    ? "border-indigo-500 text-indigo-400"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                <Bot className="w-4 h-4" />
                Marketplace Assistant Chat
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {activeTab === "job_creator" ? (
                <div className="space-y-4">
                  {/* Prompt Input & Voice Controls */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                      Speak or Type Your Project Requirement
                    </label>

                    <div className="relative">
                      <textarea
                        rows={3}
                        value={jobPrompt}
                        onChange={(e) => setJobPrompt(e.target.value)}
                        placeholder="e.g. 'I need a corporate lawyer to draft an NDA and SaaS software licensing contract within 5 days. Budget around $400 USD.'"
                        className="w-full pl-4 pr-12 py-3 bg-slate-950 border border-slate-700/80 rounded-2xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                      />

                      <button
                        type="button"
                        onClick={toggleVoice}
                        className={`absolute right-3 top-3 p-2 rounded-xl transition-all ${
                          isListening
                            ? "bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/40"
                            : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700"
                        }`}
                        title={isListening ? "Listening... click to stop" : "Click to speak requirement"}
                      >
                        {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                      </button>
                    </div>

                    {isListening && (
                      <div className="flex items-center gap-2 text-xs text-rose-400 font-medium animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                        Listening... Speak clearly into your microphone
                      </div>
                    )}
                  </div>

                  {/* Quick Preset Ideas */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                    <span className="text-slate-500">Quick ideas:</span>
                    <button
                      type="button"
                      onClick={() =>
                        setJobPrompt(
                          "I need an AI engineer to build a production LLM agent pipeline with vector search in Python and FastAPI. Budget $800 in 2 weeks."
                        )
                      }
                      className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] transition-colors border border-slate-700/60"
                    >
                      AI Agent Pipeline ($800)
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setJobPrompt(
                          "Looking for an authorized corporate lawyer to draft commercial SaaS agreements and privacy policy for India DPDP compliance. Budget $350 in 5 days."
                        )
                      }
                      className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] transition-colors border border-slate-700/60"
                    >
                      Corporate Legal SaaS ($350)
                    </button>
                  </div>

                  {/* Generate Button */}
                  <button
                    type="button"
                    disabled={isGeneratingJob || !jobPrompt.trim()}
                    onClick={handleGenerateJob}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-sm shadow-md shadow-indigo-600/30 transition-all"
                  >
                    {isGeneratingJob ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Analyzing & Generating Job Post...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        Generate Structured Job Post with AI
                      </>
                    )}
                  </button>

                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                      {errorMsg}
                    </div>
                  )}

                  {publishSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      {publishSuccess}
                    </div>
                  )}

                  {/* Generated Result Preview Card */}
                  {generatedDraft && (
                    <div className="p-5 rounded-2xl bg-slate-950 border border-indigo-500/30 space-y-3 shadow-xl mt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded-full">
                          {generatedDraft.category_name}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          {generatedDraft.deadline_days} Days Timeline
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-white">{generatedDraft.title}</h4>

                      <div className="flex items-center gap-3 text-xs">
                        <span className="flex items-center font-bold text-emerald-400">
                          <DollarSign className="w-3.5 h-3.5 mr-0.5" />
                          ${generatedDraft.budget_min} - ${generatedDraft.budget_max} USD
                        </span>
                        <span className="text-slate-400 font-normal">
                          (~ ₹{(generatedDraft.budget_min * 84).toLocaleString("en-IN")} - ₹{(generatedDraft.budget_max * 84).toLocaleString("en-IN")} INR settlement)
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 max-h-36 overflow-y-auto whitespace-pre-line leading-relaxed">
                        {generatedDraft.description}
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {generatedDraft.suggested_skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setIsOpen(false);
                            navigate("/projects/new", { state: { aiDraft: generatedDraft } });
                          }}
                          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                        >
                          Edit in Full Form
                        </button>

                        <button
                          type="button"
                          disabled={isPublishing}
                          onClick={handlePublishDirectly}
                          className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold text-xs shadow-md shadow-emerald-600/30 transition-all"
                        >
                          {isPublishing ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              Publishing...
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Publish Directly to Marketplace
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Chat Mode */
                <div className="space-y-4">
                  <div className="space-y-3 min-h-[220px]">
                    {messages.map((m, idx) => (
                      <div
                        key={idx}
                        className={`flex gap-3 text-xs leading-relaxed ${
                          m.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        {m.role === "assistant" && (
                          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white shrink-0">
                            <Bot className="w-4 h-4" />
                          </div>
                        )}
                        <div
                          className={`p-3.5 rounded-2xl max-w-[80%] whitespace-pre-line ${
                            m.role === "user"
                              ? "bg-indigo-600 text-white"
                              : "bg-slate-950 border border-slate-800 text-slate-200"
                          }`}
                        >
                          {m.content}
                        </div>
                      </div>
                    ))}
                    {isChatLoading && (
                      <div className="flex items-center gap-2 text-xs text-indigo-400">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        BitQube Copilot is thinking...
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleSendChatMessage} className="pt-2">
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Ask about escrow, lawyers, fees, or describe what you need..."
                        className="w-full pl-4 pr-20 py-3 bg-slate-950 border border-slate-700 rounded-2xl text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />

                      <button
                        type="button"
                        onClick={toggleVoice}
                        className={`absolute right-10 p-1.5 rounded-lg transition-colors ${
                          isListening ? "text-rose-400 animate-pulse" : "text-slate-400 hover:text-white"
                        }`}
                        title="Voice Input"
                      >
                        <Mic className="w-4 h-4" />
                      </button>

                      <button
                        type="submit"
                        disabled={!inputMessage.trim() || isChatLoading}
                        className="absolute right-2 p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition-colors"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
