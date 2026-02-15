"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { Box, Text, Flex, Button } from "@chakra-ui/react";
import { FiPlay, FiPause, FiRotateCcw } from "react-icons/fi";
import { PlayerType, Role } from "@/types/Player";
import { extractFamilyNameKana } from "@/lib/nameUtils";
import UniformBack from "@/components/uniform-view/UniformBack";
import CounterSettings from "./CounterSettings";

type Props = {
  players: PlayerType[];
};

type CountState = "idle" | "counting" | "paused" | "finished";
type CountDirection = "up" | "down";

export default function NumberCounter({ players }: Props) {
  const [state, setState] = useState<CountState>("idle");
  const [direction, setDirection] = useState<CountDirection>("up");
  const [intervalMs, setIntervalMs] = useState(1000);
  const [countLimit, setCountLimit] = useState(30);
  const [countLimitInput, setCountLimitInput] = useState("30");
  const [currentNumber, setCurrentNumber] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);
  const [speechEnabled, setSpeechEnabled] = useState(true);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 選手マップを構築（支配下選手のみ）
  const playerMap = useMemo(() => {
    const map = new Map<number, PlayerType>();
    for (const player of players.filter((p) => p.role === Role.Roster)) {
      map.set(player.number_calc, player);
    }
    return map;
  }, [players]);

  // カウント範囲: 1 〜 countLimit
  const startNumber = direction === "up" ? 1 : countLimit;
  const endNumber = direction === "up" ? countLimit : 1;

  // 初期値設定
  useEffect(() => {
    setCurrentNumber(startNumber);
    setState("idle");
    stopInterval();
  }, [startNumber, direction, countLimit]);

  const currentPlayer = playerMap.get(currentNumber) ?? null;

  // 日本語音声の取得・キャッシュ
  const jaVoiceRef = useRef<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    const pickJaVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      // ja-JP を優先、なければ ja で始まる音声を使う
      jaVoiceRef.current =
        voices.find((v) => v.lang === "ja-JP") ??
        voices.find((v) => v.lang.startsWith("ja")) ??
        null;
    };

    pickJaVoice();
    // Chrome/Android: 音声リストは非同期ロードされる
    window.speechSynthesis.addEventListener("voiceschanged", pickJaVoice);
    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", pickJaVoice);
    };
  }, []);

  // 音声読み上げ
  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    // 再生中の音声があれば停止
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ja-JP";
    utterance.rate = 1.0;
    if (jaVoiceRef.current) {
      utterance.voice = jaVoiceRef.current;
    }
    window.speechSynthesis.speak(utterance);
  }, []);

  const speakCurrentNumber = useCallback(
    (num: number) => {
      const player = playerMap.get(num);
      if (player) {
        speak(extractFamilyNameKana(player.name_kana));
      } else {
        speak("べいすたーず");
      }
    },
    [playerMap, speak],
  );

  const stopInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // 次の番号を計算（副作用なし）
  const getNextNumber = useCallback(
    (prev: number) => {
      return direction === "up" ? prev + 1 : prev - 1;
    },
    [direction],
  );

  const isAtEnd = useCallback(
    (num: number) => {
      return (
        (direction === "up" && num > endNumber) ||
        (direction === "down" && num < endNumber)
      );
    },
    [direction, endNumber],
  );

  // カウント1ステップ進める
  const tick = useCallback(() => {
    setFadeIn(false);
    setTimeout(() => {
      setCurrentNumber((prev) => {
        const next = getNextNumber(prev);
        if (isAtEnd(next)) {
          stopInterval();
          setState("finished");
          return prev;
        }
        // 副作用（音声）は次のレンダーで useEffect から実行
        return next;
      });
      setFadeIn(true);
    }, 150);
  }, [getNextNumber, isAtEnd, stopInterval]);

  // 再生開始
  const start = useCallback(() => {
    // iOS Safari 対策: ユーザーアクション内で初回speak
    if (speechEnabled) {
      speakCurrentNumber(currentNumber);
    }
    setState("counting");
    intervalRef.current = setInterval(tick, intervalMs);
  }, [currentNumber, intervalMs, speechEnabled, speakCurrentNumber, tick]);

  // 再開
  const resume = useCallback(() => {
    setState("counting");
    intervalRef.current = setInterval(tick, intervalMs);
  }, [intervalMs, tick]);

  // 一時停止
  const pause = useCallback(() => {
    stopInterval();
    setState("paused");
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, [stopInterval]);

  // リセット
  const reset = useCallback(() => {
    stopInterval();
    setState("idle");
    setCurrentNumber(startNumber);
    setFadeIn(true);
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, [stopInterval, startNumber]);

  // カウント中に番号が変わったら音声を発声
  const prevNumberRef = useRef(currentNumber);
  useEffect(() => {
    if (
      speechEnabled &&
      state === "counting" &&
      currentNumber !== prevNumberRef.current
    ) {
      speakCurrentNumber(currentNumber);
    }
    prevNumberRef.current = currentNumber;
  }, [currentNumber, state, speechEnabled, speakCurrentNumber]);

  // クリーンアップ
  useEffect(() => {
    return () => {
      stopInterval();
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [stopInterval]);

  // intervalMs 変更時にカウント中なら再設定
  useEffect(() => {
    if (state === "counting") {
      stopInterval();
      intervalRef.current = setInterval(tick, intervalMs);
    }
  }, [intervalMs, state, stopInterval, tick]);

  // 表示情報
  const uniformName = currentPlayer?.uniform_name ?? "BAYSTARS";
  const numberDisp = currentPlayer?.number_disp ?? String(currentNumber);
  const displayName = currentPlayer?.name ?? "ベイスターズ";
  const displayKana = currentPlayer ? currentPlayer.name_kana : "べいすたーず";

  const handleCountLimitSelect = useCallback((value: string) => {
    setCountLimitInput(value);
    const v = parseInt(value, 10);
    if (!isNaN(v) && v >= 1 && v <= 200) {
      setCountLimit(v);
    }
  }, []);

  return (
    <Box w="100%" maxW="400px" mx="auto" userSelect="none">
      {/* 設定 */}
      <Box mb={6}>
        <CounterSettings
          direction={direction}
          onDirectionChange={setDirection}
          intervalMs={intervalMs}
          onIntervalMsChange={setIntervalMs}
          countLimitInput={countLimitInput}
          onCountLimitSelect={handleCountLimitSelect}
          onCountLimitFocus={() => setCountLimitInput("")}
          onCountLimitBlur={() => setCountLimitInput(String(countLimit))}
          speechEnabled={speechEnabled}
          onSpeechEnabledChange={setSpeechEnabled}
          disabled={state === "counting"}
        />
      </Box>

      {/* ユニフォーム表示 */}
      <Box
        style={{
          opacity: fadeIn ? 1 : 0,
          transition: "opacity 0.15s ease-in-out",
        }}
      >
        <UniformBack
          uniformName={uniformName}
          numberDisp={numberDisp}
          clipPathId="countUniformClip"
        />
      </Box>

      {/* 選手情報 */}
      <Box textAlign="center" mb={4}>
        <Text fontSize="lg" fontWeight="bold" color="text.primary">
          {displayName}
        </Text>
        <Text fontSize="sm" color="text.secondary">
          {displayKana}
        </Text>
      </Box>

      {/* 進捗 */}
      <Text textAlign="center" mb={4} fontSize="sm" color="text.secondary">
        {currentNumber} / {endNumber}
      </Text>

      {/* 操作ボタン */}
      <Flex justify="center" align="center" gap={4} mb={6}>
        {/* リセット */}
        <Button
          onClick={reset}
          variant="outline"
          size="sm"
          borderRadius="full"
          aria-label="リセット"
          disabled={state === "idle"}
        >
          <FiRotateCcw />
        </Button>

        {/* 再生/停止 */}
        {state === "counting" ? (
          <Button
            onClick={pause}
            colorPalette="blue"
            size="lg"
            borderRadius="full"
            aria-label="停止"
            w="56px"
            h="56px"
          >
            <FiPause size={24} />
          </Button>
        ) : (
          <Button
            onClick={state === "paused" ? resume : start}
            colorPalette="blue"
            size="lg"
            borderRadius="full"
            aria-label="再生"
            w="56px"
            h="56px"
            disabled={state === "finished"}
          >
            <FiPlay size={24} />
          </Button>
        )}
      </Flex>
    </Box>
  );
}
