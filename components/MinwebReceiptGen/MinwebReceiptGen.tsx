'use client';
import styles from './MinwebReceiptGen.module.css';
import { useEffect, useMemo, useState } from 'react';

export type ReceiptItem = {
  itemName: string;
  price: number;
};

export interface MinwebReceiptGenProps {
	businessName: string;
	items: ReceiptItem[];
	logoSrc: string;
	agencyName?: string;
	currencySymbol?: string;
	onTotalChange?: (total: number) => void;
}

export default function MinwebReceiptGen2({
	businessName, items, logoSrc, agencyName = 'MINWEB', currencySymbol = '$', onTotalChange
}: MinwebReceiptGenProps) {
	const [activeMap, setActiveMap] = useState<boolean[]>(() => items.map(() => true));

	// Re-sync if the items array itself changes length (e.g. new data fetched in).
	useEffect(() => {
		setActiveMap((prev) => (prev.length === items.length ? prev : items.map(() => true)));
	}, [items]);

	const total = useMemo(
		() => items.reduce((sum, item, i) => (activeMap[i] ? sum + item.price : sum), 0),
		[items, activeMap]
	);

	useEffect(() => {
		onTotalChange?.(total);
	}, [total, onTotalChange]);

	const toggleItem = (index: number) => {
		setActiveMap((prev) => prev.map((value, i) => (i === index ? !value : value)));
	};
	const formatPrice = (value: number) => `${currencySymbol}${value.toFixed(2)}`;

	return (
		<div className={`${styles.wrapper}`}>
			<article className={styles.card} aria-label={`Monthly receipt for ${businessName}`}>
			<header className={styles.header}>
				{logoSrc ? (
					<img src={logoSrc} alt={`${agencyName} logo`} className={styles.logo} />
				) : (
					<div className={styles.logoFallback} aria-hidden="true">
						{agencyName.trim().slice(0, 2).toUpperCase()}
					</div>
				)}
				<div className={styles.billTo}>
					<span className={styles.eyebrow}>Billed to</span>
					<span className={styles.businessName}>{businessName}</span>
				</div>
			</header>
			<div className={styles.divider} role="presentation" />
			<ul className={styles.itemList}>
				{items.map((item, index) => {
					const active = activeMap[index];
					return (
					<li key={`${item.itemName}-${index}`}>
						<button
							type="button"
							className={`${styles.itemRow} ${active ? '' : styles.itemRowRemoved}`}
							onClick={() => toggleItem(index)}
							aria-pressed={!active}
							aria-label={`${item.itemName}, ${formatPrice(item.price)}. ${
							active ? 'Included in total, tap to exclude.' : 'Excluded from total, tap to include.'
							}`}
						>
							<span className={styles.itemMarker} aria-hidden="true" />
							<span className={styles.itemName}>{item.itemName}</span>
							<span className={styles.itemDots} aria-hidden="true" />
							<span className={styles.itemPrice}>{formatPrice(item.price)}</span>
						</button>
					</li>
					);
				})}
			</ul>

			<div className={styles.divider} role="presentation" />

			<div className={styles.totalRow}>
				<span className={styles.totalLabel}>Total</span>
				<span className={styles.totalValue}>
					{formatPrice(total)}
					<span className={styles.perMonth}>/month</span>
				</span>
			</div>

			<div className={styles.barcode} aria-hidden="true" />
			<p className={styles.footerNote}>Tap a line item to include or exclude it from the total</p>
			</article>
		</div>
	);
}