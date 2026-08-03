import styles from "./ScoreStamp.module.css";

type Tone = "teal" | "amber" | "rust" | "gold" | "slate";
export interface ScoreStampProps {
	value: number;
	tone: Tone;
	primary: string;
	secondary?: string;
	caption?: string;
	size?: "lg" | "md";
}

const R = 50;
const CIRCUMFERENCE = 2 * Math.PI * R;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export default function ScoreStamp({
	value,
	tone,
	primary,
	secondary,
	caption,
	size = "lg",
}: ScoreStampProps) {
	const pct = clamp(value, 0, 100) / 100;
	const offset = CIRCUMFERENCE * (1 - pct);

	return (
		<figure className={styles.wrap} data-size={size}>
			<div className={styles.dial} data-tone={tone}>
				<svg viewBox="0 0 120 120" className={styles.svg} aria-hidden="true">
					<circle className={styles.track} cx="60" cy="60" r={R} />
					<circle className={styles.ticks} cx="60" cy="60" r={R - 10} />
					<circle
						className={styles.progress}
						cx="60"
						cy="60"
						r={R}
						strokeDasharray={CIRCUMFERENCE}
						strokeDashoffset={offset}
						transform="rotate(-90 60 60)"
					/>
				</svg>
				<div className={styles.center}>
					<span className={styles.primary}>{primary}</span>
					{secondary ? <span className={styles.secondary}>{secondary}</span> : null}
				</div>
			</div>
			{caption ? <figcaption className={styles.caption}>{caption}</figcaption> : null}
		</figure>
	);
}
