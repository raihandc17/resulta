import styles from "./LoadingSkeleton.module.css";

function Block({ className = "" }) {
  return (
    <div
      className={`${styles.block} ${className}`.trim()}
      aria-hidden="true"
    />
  );
}

function ProductCardSkeleton() {
  return (
    <div className={styles.card}>
      <Block className={styles.cardMedia} />
      <div className={styles.cardBody}>
        <Block className={styles.lineLg} />
        <Block className={styles.lineSm} />
        <Block className={styles.lineBtn} />
      </div>
    </div>
  );
}

export function ShopDataSkeleton({ tab = "products", contentOnly = false }) {
  const showGrid = tab === "products" || tab === "favorites";
  const showOrders = tab === "orders";
  const showCart = tab === "cart";

  const body = (
    <>
      {showGrid ? (
        <div className={styles.grid}>
          {Array.from({ length: 6 }, (_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : null}

      {showOrders ? (
        <div className={styles.tableWrap}>
          <div className={`${styles.tableHead} ${styles.ordersHead}`}>
            {Array.from({ length: 7 }, (_, i) => (
              <Block key={i} className={styles.tableHeadCell} />
            ))}
          </div>
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className={`${styles.tableRow} ${styles.ordersRow}`}>
              {Array.from({ length: 7 }, (_, j) => (
                <Block
                  key={j}
                  className={
                    j === 1 ? styles.tableCellWide : styles.tableCell
                  }
                />
              ))}
            </div>
          ))}
        </div>
      ) : null}

      {showCart ? (
        <div className={styles.cartBlock}>
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className={styles.cartLine}>
              <Block className={styles.cartThumb} />
              <div className={styles.cartText}>
                <Block className={styles.lineLg} />
                <Block className={styles.lineSm} />
              </div>
            </div>
          ))}
          <Block className={styles.lineBtn} />
        </div>
      ) : null}
    </>
  );

  if (contentOnly) {
    return (
      <div className={styles.panel} role="status" aria-busy="true">
        <span className={styles.srOnly}>Loading shopping data…</span>
        {body}
      </div>
    );
  }

  return (
    <div className={styles.panel} role="status" aria-busy="true">
      <span className={styles.srOnly}>Loading shopping data…</span>
      <div className={styles.shopHeader}>
        <div style={{ flex: 1 }}>
          <Block className={styles.title} />
          <div className={styles.tabs}>
            {[0, 1, 2, 3].map((i) => (
              <Block
                key={i}
                className={`${styles.tab} ${i === 1 ? styles.tabWide : ""}`}
              />
            ))}
          </div>
        </div>
        <Block className={styles.addBtn} />
      </div>
      {body}
    </div>
  );
}

export function ProjectsTableSkeleton() {
  return (
    <div className={styles.panel} role="status" aria-busy="true">
      <span className={styles.srOnly}>Loading projects…</span>
      <Block className={styles.title} />
      <div className={styles.toolbar}>
        <Block className={styles.toolbarItem} />
        <Block className={styles.toolbarItem} />
        <Block className={styles.toolbarItem} />
        <Block className={styles.toolbarItem} />
      </div>
      <div className={styles.tableWrap}>
        <div className={styles.tableHead}>
          {Array.from({ length: 4 }, (_, i) => (
            <Block key={i} className={styles.tableHeadCell} />
          ))}
        </div>
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className={styles.tableRow}>
            <Block className={styles.tableCell} />
            <Block className={styles.tableCell} />
            <Block className={`${styles.tableCell} ${styles.tableCellWide}`} />
            <Block className={styles.tableCell} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardSectionSkeleton() {
  return (
    <div className={styles.panel} role="status" aria-busy="true">
      <span className={styles.srOnly}>Loading…</span>
      <Block className={styles.title} />
      <Block className={styles.placeholderBlock} />
    </div>
  );
}
