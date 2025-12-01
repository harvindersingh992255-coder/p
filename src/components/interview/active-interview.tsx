'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { generateInterviewQuestions } from '@/ai/flows/generate-interview-questions';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Mic, MicOff, Video, VideoOff, Square, Loader2, ArrowRight, SkipForward, Type } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import type { InterviewQuestion } from '@/lib/types';

const mockQuestions = [
    "Tell me about a time you faced a challenge at work.",
    "What are your biggest strengths and weaknesses?",
    "Where do you see yourself in 5 years?",
    "Why do you want to work for this company?",
    "Describe a project you are proud of."
];


export function ActiveInterview() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { text, startListening, stopListening, isListening, hasRecognitionSupport, setText } = useSpeechRecognition();
  
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [textAnswer, setTextAnswer] = useState('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const [answers, setAnswers] = useState<InterviewQuestion[]>([]);


  useEffect(() => {
    const fetchQuestions = async () => {
      const jobRole = searchParams.get('jobRole') || 'Software Engineer';
      const industry = searchParams.get('industry') || 'Technology';
      const interviewLength = parseInt(searchParams.get('interviewLength') || '5', 10);
      try {
        // const result = await generateInterviewQuestions({ jobRole, industry, numQuestions: interviewLength });
        // setQuestions(result.questions);
        setQuestions(mockQuestions.slice(0, interviewLength)); // Using mock questions for now
      } catch (error) {
        console.error("Failed to generate questions:", error);
        toast({ title: "Error", description: "Could not fetch interview questions. Using defaults.", variant: "destructive" });
        setQuestions(mockQuestions);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuestions();
  }, [searchParams, toast]);

  const toggleCamera = async () => {
    if (isCameraOn) {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
      videoRef.current!.srcObject = null;
      setIsCameraOn(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        videoRef.current!.srcObject = stream;
        setIsCameraOn(true);
      } catch (error) {
        console.error("Error accessing camera:", error);
        toast({ title: "Camera Error", description: "Could not access your camera.", variant: "destructive" });
      }
    }
  };
  
  const handleStartRecording = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    if (stream) {
        recordedChunksRef.current = [];
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        
        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recordedChunksRef.current.push(event.data);
            }
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
          const videoUrl = URL.createObjectURL(blob);
          saveAnswer(text, videoUrl);
        };

        mediaRecorderRef.current.start();
    }
    startListening();
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
    }
    stopListening();
  };

  const saveAnswer = (userAnswer: string, videoUrl?: string) => {
     setAnswers(prev => [
        ...prev,
        {
          id: `q-${currentQuestionIndex}`,
          question: questions[currentQuestionIndex],
          userAnswer: userAnswer,
          videoUrl: videoUrl,
        }
      ]);
  }
  
  const finishInterview = () => {
    // In a real app, you'd save this to a database
    const sessionData = {
      id: `sess_${Date.now()}`,
      date: new Date().toISOString(),
      jobRole: searchParams.get('jobRole') || 'Software Engineer',
      industry: searchParams.get('industry') || 'Technology',
      overallScore: 0, // This would be calculated later
      questions: answers,
    };
    localStorage.setItem('latestInterviewSession', JSON.stringify(sessionData));
    router.push(`/interview/results/${sessionData.id}`);
  }

  const handleNextQuestion = () => {
    if (isListening) {
      handleStopRecording();
    } else if (textAnswer) {
      saveAnswer(textAnswer);
    } else {
      saveAnswer(''); // Save an empty answer if nothing was said or typed
    }
    
    setText('');
    setTextAnswer('');

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      finishInterview();
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground">Preparing your interview...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} className="w-full mb-4" />
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Question {currentQuestionIndex + 1} of {questions.length}</h2>
        <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={toggleCamera}>
                {isCameraOn ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
            </Button>
            {/* Timer placeholder */}
            <div className="text-lg font-mono p-2 rounded-md bg-muted">02:30</div>
        </div>
      </div>
      
      <Card className="flex-grow flex flex-col">
        <CardContent className="p-6 flex-grow flex flex-col gap-6">
            <p className="text-xl font-medium text-center">{questions[currentQuestionIndex]}</p>
            <div className="relative flex-grow bg-muted rounded-lg overflow-hidden border">
                <video ref={videoRef} autoPlay muted className="w-full h-full object-cover"></video>
                {!isCameraOn && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <VideoOff className="h-16 w-16 text-white/50" />
                    </div>
                )}
            </div>
            
            <Tabs defaultValue="voice" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="voice" disabled={!hasRecognitionSupport}>
                  <Mic className="mr-2 h-4 w-4" />
                  Voice
                </TabsTrigger>
                <TabsTrigger value="text">
                  <Type className="mr-2 h-4 w-4" />
                  Text
                </TabsTrigger>
              </TabsList>
              <TabsContent value="voice">
                <div className="flex flex-col items-center gap-4 py-4">
                  <Button 
                    onClick={isListening ? handleStopRecording : handleStartRecording} 
                    disabled={!hasRecognitionSupport || !isCameraOn}
                    size="lg"
                    className="w-36"
                  >
                    {isListening ? (
                      <>
                        <MicOff className="mr-2 h-4 w-4 animate-pulse" />
                        Stop
                      </>
                    ) : (
                      <>
                        <Mic className="mr-2 h-4 w-4" />
                        Answer
                      </>
                    )}
                  </Button>
                  <p className="text-sm text-muted-foreground h-10 italic">
                    {text ? text : (isListening ? "Listening..." : "Click 'Answer' to start recording")}
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="text">
                <div className="py-4">
                  <Textarea 
                    placeholder="Type your answer here..."
                    className="min-h-[100px]"
                    value={textAnswer}
                    onChange={(e) => setTextAnswer(e.target.value)}
                  />
                </div>
              </TabsContent>
            </Tabs>
        </CardContent>
        <CardFooter className="flex-col sm:flex-row justify-between items-center gap-4 p-4 border-t">
          <div className="flex gap-2">
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                        <Square className="mr-2 h-4 w-4" />
                        End Interview
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to end the interview?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will end your current session. You'll be taken to the results page.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={finishInterview}>
                        End Interview
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <Button variant="outline" onClick={handleNextQuestion}>
                <SkipForward className="mr-2 h-4 w-4" />
                Skip
            </Button>
          </div>
          <Button size="lg" onClick={handleNextQuestion}>
            {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish & View Results'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
