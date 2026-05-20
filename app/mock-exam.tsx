import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { AppHeader } from "@/components/ui/app-header";
import { RichInlineText } from "@/components/ui/rich-text";
import { Screen } from "@/components/ui/screen";
import { getMockExamQuestions, type QuestionSource } from "@/lib/quiz-content";
import { topicService, type TopicQuestion } from "@/lib/topic-service";
import { useMockResultStore, type MockResult } from "@/store/mock-result-store";

const OPTION_LABELS = ["ক", "খ", "গ", "ঘ"];
type AnswerFilter = "all" | "answered" | "unanswered";

const FILTER_LABELS: Record<AnswerFilter, string> = {
  all: "All questions",
  answered: "Answered",
  unanswered: "Unanswered",
};

const getParam = (value: string | string[] | undefined, fallback = "") =>
  Array.isArray(value) ? value[0] || fallback : value || fallback;

const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export default function MockExamScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const saveResult = useMockResultStore((state) => state.saveResult);
  const allowLeaveRef = useRef(false);
  const reviewId = getParam(params.review);
  const reviewResult = useMockResultStore((state) =>
    reviewId ? state.results[reviewId] : null,
  );
  const topics = useMemo(
    () =>
      getParam(params.topics)
        .split("||")
        .map((item) => item.trim())
        .filter(Boolean),
    [params.topics],
  );
  const questionCount =
    reviewResult?.totalQuestions ?? Number(getParam(params.questions, "25"));
  const totalTime =
    reviewResult?.totalTime ??
    Number(getParam(params.time, String(Math.max(10, questionCount))));
  const hasNegativeMarking =
    reviewResult?.hasNegativeMarking ??
    getParam(params.negative, "true") !== "false";
  const source = getParam(params.source, "all") as QuestionSource;
  const [remainingSeconds, setRemainingSeconds] = useState(
    reviewId ? 0 : totalTime * 60,
  );
  const [answers, setAnswers] = useState<Record<number, number>>(
    reviewResult?.answers ?? {},
  );
  const [lockedQuestions, setLockedQuestions] = useState<Record<number, true>>(
    {},
  );
  const [submitted, setSubmitted] = useState(Boolean(reviewId));
  const [answerFilter, setAnswerFilter] = useState<AnswerFilter>("all");
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [submitConfirmationOpen, setSubmitConfirmationOpen] = useState(false);
  const [backConfirmationOpen, setBackConfirmationOpen] = useState(false);
  const [questions, setQuestions] = useState<TopicQuestion[]>(
    reviewResult?.questions ?? [],
  );
  const [questionsLoading, setQuestionsLoading] = useState(!reviewResult);
  const [explanationQuestion, setExplanationQuestion] =
    useState<TopicQuestion | null>(null);

  const answeredCount = Object.keys(answers).length;
  const unansweredCount = Math.max(questions.length - answeredCount, 0);
  const wrongCount = questions.filter((question) => {
    const answer = answers[question.id];
    return answer !== undefined && answer !== question.answer;
  }).length;
  const correctCount = answeredCount - wrongCount;
  const score = questions.reduce((total, question) => {
    const answer = answers[question.id];
    if (answer === undefined) return total;
    if (answer === question.answer) return total + 1;
    return hasNegativeMarking ? total - 0.5 : total;
  }, 0);
  const filteredQuestions = useMemo(() => {
    if (answerFilter === "answered")
      return questions.filter((q) => answers[q.id] !== undefined);
    if (answerFilter === "unanswered")
      return questions.filter((q) => answers[q.id] === undefined);
    return questions;
  }, [answerFilter, answers, questions]);

  const finishExam = useCallback(() => {
    allowLeaveRef.current = true;
    const resultId = `${Date.now()}`;
    const result: MockResult = {
      id: resultId,
      submittedAt: new Date().toISOString(),
      topics,
      totalTime,
      hasNegativeMarking,
      totalQuestions: questions.length,
      answers,
      questions,
      answeredCount,
      correctCount,
      wrongCount,
      unansweredCount,
      score,
      rows: questions.map((question) => {
        const selectedAnswer = answers[question.id];
        const isAnswered = selectedAnswer !== undefined;
        const isCorrect = selectedAnswer === question.answer;
        return {
          id: question.id,
          topic: question.topic,
          prompt: question.prompt,
          selectedAnswer:
            selectedAnswer === undefined
              ? null
              : question.options[selectedAnswer],
          correctAnswer: question.options[question.answer],
          status: !isAnswered ? "Unanswered" : isCorrect ? "Correct" : "Wrong",
          mark: !isAnswered ? 0 : isCorrect ? 1 : hasNegativeMarking ? -0.5 : 0,
        };
      }),
    };
    saveResult(result);
    setSubmitted(true);
    setSubmitConfirmationOpen(false);
    setBackConfirmationOpen(false);
    router.replace({ pathname: "/mock-result", params: { id: resultId } });
  }, [
    answeredCount,
    answers,
    correctCount,
    hasNegativeMarking,
    questions,
    router,
    saveResult,
    score,
    topics,
    totalTime,
    unansweredCount,
    wrongCount,
  ]);

  useEffect(() => {
    if (reviewResult) {
      setQuestions(reviewResult.questions);
      setAnswers(reviewResult.answers ?? {});
      setSubmitted(true);
      setRemainingSeconds(0);
      setQuestionsLoading(false);
      return;
    }
    let mounted = true;
    const loadQuestions = async () => {
      setQuestionsLoading(true);
      try {
        const response = await topicService.getQuestions({
          topics: topics.length > 0 ? topics : ["Mock Master"],
          type: source,
          limit: questionCount,
        });
        if (mounted) {
          setQuestions(
            response.data.length > 0
              ? response.data
              : getMockExamQuestions(
                  topics.length > 0 ? topics : ["Mock Master"],
                  questionCount,
                  source,
                ),
          );
        }
      } catch {
        if (mounted) {
          setQuestions(
            getMockExamQuestions(
              topics.length > 0 ? topics : ["Mock Master"],
              questionCount,
              source,
            ),
          );
        }
      } finally {
        if (mounted) setQuestionsLoading(false);
      }
    };
    loadQuestions();
    return () => {
      mounted = false;
    };
  }, [questionCount, reviewResult, source, topics]);

  useEffect(() => {
    if (submitted || reviewResult) return;
    const timer = setInterval(() => {
      setRemainingSeconds((current) => {
        if (current <= 1) {
          clearInterval(timer);
          finishExam();
          return 0;
        }
        return current - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [finishExam, reviewResult, submitted]);

  useEffect(() => {
    const beforeRemove = navigation.addListener("beforeRemove", (event) => {
      if (submitted || reviewResult || allowLeaveRef.current) return;
      event.preventDefault();
      setBackConfirmationOpen(true);
    });
    return beforeRemove;
  }, [navigation, reviewResult, submitted]);

  const handleAnswerSelect = (questionId: number, optionIndex: number) => {
    if (submitted || reviewResult || lockedQuestions[questionId]) return;
    setAnswers((current) => ({ ...current, [questionId]: optionIndex }));
    setLockedQuestions((current) => ({ ...current, [questionId]: true }));
  };

  return (
    <View className="flex-1 bg-background dark:bg-slate-950">
      <AppHeader
        title={reviewResult ? "মক রিভিউ" : "মক পরীক্ষা"}
        subtitle={`${topics.length || 1}টি টপিক • সময়ঃ ${totalTime} মিনিট`}
        showBack
        onBackPress={
          reviewResult
            ? () =>
                router.replace({
                  pathname: "/mock-result",
                  params: { id: reviewId },
                })
            : () => setBackConfirmationOpen(true)
        }
      />

      {/* Sticky filter bar */}
      <View className="border-b border-border bg-card/95 px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
        <View className="flex-row items-center justify-between gap-3 rounded-2xl border border-border bg-background/70 p-3 dark:border-slate-800">
          <View>
            <Text className="text-sm font-semibold text-foreground dark:text-slate-100">
              প্রশ্ন ফিল্টার
            </Text>
            <Text className="mt-1 text-xs text-muted-foreground">
              Answered {answeredCount} • Unanswered {unansweredCount}
            </Text>
          </View>
          <Pressable
            className="w-44 flex-row items-center justify-between rounded-md border border-border bg-card px-3 py-2 dark:border-slate-700 dark:bg-slate-800"
            onPress={() => setFilterDropdownOpen(true)}
          >
            <Text className="text-sm text-foreground dark:text-slate-100">
              {FILTER_LABELS[answerFilter]}
            </Text>
            <MaterialCommunityIcons
              name="chevron-down"
              size={16}
              color="#94a3b8"
            />
          </Pressable>
        </View>
      </View>

      <Screen>
        {submitted ? (
          <View className="mb-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
            <Text className="text-center text-sm font-semibold text-emerald-700 dark:text-emerald-300">
              সাবমিট সম্পন্ন হয়েছে
            </Text>
            <Text className="mt-1 text-center text-2xl font-bold text-foreground dark:text-slate-50">
              স্কোর: {score}/{questionCount}
            </Text>
          </View>
        ) : null}

        {questionsLoading ? (
          <View className="mt-4 rounded-2xl border border-border bg-card/70 px-4 py-8">
            <Text className="text-center text-sm text-muted-foreground">
              Loading questions...
            </Text>
          </View>
        ) : null}

        {!questionsLoading && filteredQuestions.length === 0 ? (
          <View className="mt-4 rounded-2xl border border-dashed border-border bg-card/70 px-4 py-8">
            <Text className="text-center text-sm text-muted-foreground">
              No questions found for this filter.
            </Text>
          </View>
        ) : null}

        <View className="mt-4 gap-5">
          {filteredQuestions.map((question) => (
            <View
              key={question.id}
              className="border-b border-border pb-5 dark:border-slate-800"
            >
              <RichInlineText
                html={`${question.id}. ${question.prompt}`}
                className="text-lg font-semibold leading-7 text-foreground dark:text-slate-100"
              />
              <View className="mt-4 gap-3">
                {question.options.map((option, optionIndex) => {
                  const isSelected = answers[question.id] === optionIndex;
                  const isLocked = Boolean(lockedQuestions[question.id]);
                  const isReview = submitted || Boolean(reviewResult);
                  const isUnavailable = isLocked && !isSelected && !isReview;
                  const isCorrect = isReview && question.answer === optionIndex;
                  const isWrong =
                    isReview && isSelected && question.answer !== optionIndex;

                  return (
                    <Pressable
                      key={`${question.id}-${optionIndex}`}
                      disabled={isUnavailable || isReview}
                      className={`rounded-2xl border px-4 py-4 ${
                        isCorrect
                          ? "border-emerald-500 bg-emerald-500/10"
                          : isWrong
                            ? "border-rose-500 bg-rose-500/10"
                            : isSelected
                              ? "border-primary bg-primary/10"
                              : "border-border bg-card dark:border-slate-800 dark:bg-slate-900"
                      } ${isUnavailable ? "opacity-60" : ""}`}
                      onPress={() =>
                        handleAnswerSelect(question.id, optionIndex)
                      }
                    >
                      <View className="flex-row items-center gap-4">
                        <Text className="h-9 w-9 rounded-full border border-current pt-2 text-center text-base font-bold text-foreground dark:text-slate-100">
                          {OPTION_LABELS[optionIndex]}
                        </Text>
                        <RichInlineText
                          html={option}
                          className="flex-1 text-base font-medium text-foreground dark:text-slate-100"
                        />
                        {isReview && isCorrect ? (
                          <MaterialCommunityIcons
                            name="check-circle"
                            size={20}
                            color="#10b981"
                          />
                        ) : null}
                        {isReview && isWrong ? (
                          <MaterialCommunityIcons
                            name="close-circle"
                            size={20}
                            color="#f43f5e"
                          />
                        ) : null}
                      </View>
                    </Pressable>
                  );
                })}
              </View>
              {submitted ? (
                <Pressable
                  className="mt-3 flex-row items-center gap-2"
                  onPress={() => setExplanationQuestion(question)}
                >
                  <MaterialCommunityIcons
                    name="book-open-page-variant-outline"
                    size={18}
                    color="#6366f1"
                  />
                  <Text className="text-sm font-semibold text-primary">
                    ব্যাখ্যা
                  </Text>
                </Pressable>
              ) : null}
            </View>
          ))}
        </View>
      </Screen>

      {/* Submit bar */}
      {!reviewResult ? (
        <View className="border-t border-border bg-card/95 px-5 py-3 dark:border-slate-800 dark:bg-slate-900">
          <Pressable
            className={`h-16 w-full flex-row items-center rounded-3xl bg-primary px-5 ${submitted || questionsLoading ? "opacity-50" : ""}`}
            disabled={submitted || questionsLoading}
            onPress={() => setSubmitConfirmationOpen(true)}
          >
            <Text className="flex-1 text-left text-xl font-bold text-white">
              {formatTime(remainingSeconds)}
            </Text>
            <Text className="border-x border-white/30 px-5 text-xl font-bold text-white">
              সাবমিট করো
            </Text>
            <Text className="flex-1 text-right text-xl font-bold text-white">
              {answeredCount}/{questions.length || questionCount}
            </Text>
          </Pressable>
        </View>
      ) : null}

      {/* Filter dropdown modal */}
      <Modal
        transparent
        visible={filterDropdownOpen}
        animationType="fade"
        onRequestClose={() => setFilterDropdownOpen(false)}
      >
        <Pressable
          className="flex-1 bg-black/40"
          onPress={() => setFilterDropdownOpen(false)}
        >
          <View className="absolute right-6 top-40 w-44 overflow-hidden rounded-xl border border-border bg-card shadow-lg dark:border-slate-700 dark:bg-slate-900">
            {(["all", "answered", "unanswered"] as AnswerFilter[]).map(
              (filter) => (
                <Pressable
                  key={filter}
                  className="flex-row items-center justify-between px-3 py-3 active:bg-accent"
                  onPress={() => {
                    setAnswerFilter(filter);
                    setFilterDropdownOpen(false);
                  }}
                >
                  <Text className="text-sm text-foreground dark:text-slate-100">
                    {FILTER_LABELS[filter]}
                  </Text>
                  {answerFilter === filter ? (
                    <MaterialCommunityIcons
                      name="check"
                      size={14}
                      color="#6366f1"
                    />
                  ) : null}
                </Pressable>
              ),
            )}
          </View>
        </Pressable>
      </Modal>

      {/* Submit confirmation modal */}
      <Modal
        transparent
        visible={submitConfirmationOpen}
        animationType="fade"
        onRequestClose={() => setSubmitConfirmationOpen(false)}
      >
        <View className="flex-1 items-center justify-center bg-black/40 px-6">
          <View className="w-full rounded-3xl bg-card p-6 dark:bg-slate-900">
            <View className="mb-4 items-center">
              <View className="rounded-2xl bg-primary/10 p-3">
                <MaterialCommunityIcons
                  name="clipboard-check-outline"
                  size={32}
                  color="#6366f1"
                />
              </View>
            </View>
            <Text className="text-center text-lg font-bold text-foreground dark:text-slate-50">
              পরীক্ষা সাবমিট করবেন?
            </Text>
            <Text className="mt-2 text-center text-sm text-muted-foreground">
              আপনি {answeredCount}/{questions.length}টি প্রশ্নের উত্তর দিয়েছেন।
              সাবমিট করার পর উত্তর পরিবর্তন করা যাবে না।
            </Text>
            <View className="mt-5 flex-row gap-3">
              <Pressable
                className="flex-1 rounded-2xl border border-border bg-card py-3 dark:border-slate-700"
                onPress={() => setSubmitConfirmationOpen(false)}
              >
                <Text className="text-center font-semibold text-foreground dark:text-black">
                  Stay
                </Text>
              </Pressable>
              <Pressable
                className="flex-1 rounded-2xl bg-primary py-3"
                onPress={finishExam}
              >
                <Text className="text-center font-semibold text-white">
                  Submit
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Back confirmation modal */}
      <Modal
        transparent
        visible={backConfirmationOpen}
        animationType="fade"
        onRequestClose={() => setBackConfirmationOpen(false)}
      >
        <View className="flex-1 items-center justify-center bg-black/40 px-6">
          <View className="w-full rounded-3xl bg-card p-6 dark:bg-slate-900">
            <View className="mb-4 items-center">
              <View className="rounded-2xl bg-rose-500/10 p-3">
                <MaterialCommunityIcons
                  name="logout"
                  size={32}
                  color="#f43f5e"
                />
              </View>
            </View>
            <Text className="text-center text-lg font-bold text-foreground dark:text-slate-50">
              পরীক্ষা থেকে বের হবেন?
            </Text>
            <Text className="mt-2 text-center text-sm text-muted-foreground">
              পরীক্ষা চলাকালীন সরাসরি ফিরে যাওয়া যাবে না। বের হতে চাইলে বর্তমান
              উত্তরগুলো সাবমিট হবে।
            </Text>
            <View className="mt-5 flex-row gap-3">
              <Pressable
                className="flex-1 rounded-2xl border border-border bg-card py-3 dark:border-slate-700"
                onPress={() => setBackConfirmationOpen(false)}
              >
                <Text className="text-center font-semibold text-foreground dark:text-black">
                  Stay
                </Text>
              </Pressable>
              <Pressable
                className="flex-1 rounded-2xl bg-primary py-3"
                onPress={finishExam}
              >
                <Text className="text-center font-semibold text-white">
                  Submit and Exit
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Explanation modal */}
      <Modal
        visible={Boolean(explanationQuestion)}
        transparent
        animationType="fade"
        onRequestClose={() => setExplanationQuestion(null)}
      >
        <View className="flex-1 justify-end bg-black/40">
          <View className="rounded-t-[28px] bg-card p-5 dark:bg-slate-900">
            <View className="flex-row items-center justify-between">
              <Text className="text-xl font-bold text-foreground dark:text-slate-50">
                ব্যাখ্যা
              </Text>
              <Pressable onPress={() => setExplanationQuestion(null)}>
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color="#64748b"
                />
              </Pressable>
            </View>
            {explanationQuestion ? (
              <View className="mt-4 gap-3">
                <RichInlineText
                  html={`${explanationQuestion.id}. ${explanationQuestion.prompt}`}
                  className="text-sm font-semibold text-foreground dark:text-slate-100"
                />
                <RichInlineText
                  html={
                    explanationQuestion.explanation ||
                    "এই প্রশ্নের জন্য কোনো ব্যাখ্যা যোগ করা হয়নি।"
                  }
                  className="text-sm leading-6 text-muted-foreground dark:text-slate-300"
                />
              </View>
            ) : null}
          </View>
        </View>
      </Modal>
    </View>
  );
}
