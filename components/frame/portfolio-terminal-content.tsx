"use client";

import { useEffect, useState } from "react";

const PROMPT = "abui@portfolio % ";
const COMMAND = "pnpm install abui";

const TYPING_MS = 30;
const POST_COMMAND_MS = 140;
const AFTER_PACKAGES_MS = 90;

/** Pause after “++” before the Progress line appears (resolution “thinking”). */
const RESOLVE_PAUSE_MS = 2000;

/** How long the Progress counts take to reach their final values. */
const RESOLVE_COUNT_DURATION_MS = 1000;

const AFTER_PROGRESS_MS = 220;
const BEFORE_DOWNLOAD_MS = 100;
const DOWNLOAD_DURATION_MS = 1500;

/** Pause after the run finishes before the animation loops (retry). */
const RETRY_ANIMATION_DELAY_MS = 12000;

const PROGRESS_TARGETS = {
  resolved: 437,
  reused: 356,
  downloaded: 2,
  added: 2,
} as const;

const DOWNLOAD_TARGET_MB = 22.93;

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });
}

function formatMb(n: number) {
  return n.toFixed(2);
}

function easeOutQuad(t: number) {
  return 1 - (1 - t) * (1 - t);
}

export function PortfolioTerminalContent() {
  const [commandTyped, setCommandTyped] = useState("");
  const [showPackages, setShowPackages] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const [progressResolved, setProgressResolved] = useState(0);
  const [progressReused, setProgressReused] = useState(0);
  const [progressDownloaded, setProgressDownloaded] = useState(0);
  const [progressAdded, setProgressAdded] = useState(0);
  const [showDeps, setShowDeps] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const [downloadMb, setDownloadMb] = useState(0);

  useEffect(() => {
    let alive = true;

    async function animateProgressResolve() {
      const durationMs = RESOLVE_COUNT_DURATION_MS;
      const start = performance.now();
      const { resolved: rT, reused: uT, downloaded: dT, added: aT } = PROGRESS_TARGETS;

      return new Promise<void>((resolve) => {
        function frame(now: number) {
          if (!alive) {
            resolve();
            return;
          }
          const t = Math.min(1, (now - start) / durationMs);
          const e = easeOutQuad(t);
          setProgressResolved(Math.round(e * rT));
          setProgressReused(Math.round(e * uT));
          setProgressDownloaded(Math.round(e * dT));
          setProgressAdded(Math.round(e * aT));
          if (t < 1) requestAnimationFrame(frame);
          else {
            setProgressResolved(rT);
            setProgressReused(uT);
            setProgressDownloaded(dT);
            setProgressAdded(aT);
            resolve();
          }
        }
        requestAnimationFrame(frame);
      });
    }

    async function animateDownload() {
      const target = DOWNLOAD_TARGET_MB;
      const durationMs = DOWNLOAD_DURATION_MS;
      const start = performance.now();

      return new Promise<void>((resolve) => {
        function frame(now: number) {
          if (!alive) {
            resolve();
            return;
          }
          const t = Math.min(1, (now - start) / durationMs);
          const eased = easeOutQuad(t);
          setDownloadMb(eased * target);
          if (t < 1) requestAnimationFrame(frame);
          else {
            setDownloadMb(target);
            resolve();
          }
        }
        requestAnimationFrame(frame);
      });
    }

    async function runCycle() {
      while (alive) {
        setCommandTyped("");
        setShowPackages(false);
        setShowProgress(false);
        setProgressResolved(0);
        setProgressReused(0);
        setProgressDownloaded(0);
        setProgressAdded(0);
        setShowDeps(false);
        setShowDownload(false);
        setDownloadMb(0);

        for (let i = 0; i <= COMMAND.length; i++) {
          if (!alive) return;
          setCommandTyped(COMMAND.slice(0, i));
          await wait(i === COMMAND.length ? 0 : TYPING_MS);
        }

        await wait(POST_COMMAND_MS);
        if (!alive) return;

        setShowPackages(true);
        await wait(AFTER_PACKAGES_MS);
        if (!alive) return;

        await wait(RESOLVE_PAUSE_MS);
        if (!alive) return;

        setShowProgress(true);
        await animateProgressResolve();
        if (!alive) return;

        await wait(AFTER_PROGRESS_MS);
        if (!alive) return;

        setShowDeps(true);
        await wait(BEFORE_DOWNLOAD_MS);
        if (!alive) return;

        setShowDownload(true);
        await animateDownload();
        if (!alive) return;

        await wait(RETRY_ANIMATION_DELAY_MS);
      }
    }

    runCycle();
    return () => {
      alive = false;
    };
  }, []);

  const commandComplete = commandTyped.length === COMMAND.length;
  const showCursor = !showPackages;
  const showDownloadDone =
    showDownload && formatMb(downloadMb) === formatMb(DOWNLOAD_TARGET_MB);

  return (
    <>
      <span className="text-white/90">
        {PROMPT}
        {commandTyped}
        {showCursor ? (
          <span
            className="ml-px inline-block h-[0.95em] w-[0.5em] translate-y-[0.1em] animate-pulse bg-emerald-400/90 align-baseline"
            aria-hidden
          />
        ) : null}
      </span>
      {commandComplete ? (
        <>
          <br />
          <br />
        </>
      ) : null}
      {showPackages ? (
        <>
          Packages: <span className="text-green-500">+2</span>
          <br />
          <span className="text-green-500">++</span>
          <br />
          <br />
        </>
      ) : null}
      {showProgress ? (
        <>
          Progress: resolved <span className="text-blue-300">{progressResolved}</span>, reused{" "}
          <span className="text-blue-300">{progressReused}</span>, downloaded{" "}
          <span className="text-blue-300">{progressDownloaded}</span>, added{" "}
          <span className="text-blue-300">{progressAdded}</span>, done
          <br />
          <br />
        </>
      ) : null}
      {showDeps ? (
        <>
          dependencies: <br />
          <span className="text-green-500">+</span> abui <span className="text-blue-500">1.3.12</span>
          <br />
          <br />
        </>
      ) : null}
      {showDownload ? (
        <>
          Downloading @portfolio/abui@1.3.12:{" "}
          <span className="text-blue-300">
            {formatMb(downloadMb)} MB/22.93 MB
          </span>
          {showDownloadDone ? ", done" : null}
        </>
      ) : null}
    </>
  );
}
