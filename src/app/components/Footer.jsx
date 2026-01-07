import styles from "../DemoLanding.module.css";
import Container from "./Container";

export default function Footer(){
return(    
    <footer className={styles.footer}>
    <Container>
        <div className={styles.footerTop}>
        <div className={styles.footerBrand}>
            <div className={styles.footerBrandTitle}>Cengiz Eğitim Kurumu</div>
            <div className={styles.footerBrandText}>
            YKS / LGS hazırlıkta veri odaklı takip, düzenli deneme ve güçlü rehberlik.
            </div>
        </div>

        <div>
            <div className={styles.footerTitle}>Faydalı Linkler</div>

            <div className={styles.footerLinksGrid}>
            <a className={styles.footerChip} href="https://www.osym.gov.tr" target="_blank" rel="noreferrer">
                ÖSYM <span className={styles.ext}>↗</span>
            </a>

            <a className={styles.footerChip} href="https://ais.osym.gov.tr" target="_blank" rel="noreferrer">
                ÖSYM AİS <span className={styles.ext}>↗</span>
            </a>

            <a className={styles.footerChip} href="https://www.meb.gov.tr" target="_blank" rel="noreferrer">
                MEB <span className={styles.ext}>↗</span>
            </a>

            <a className={styles.footerChip} href="https://e-okul.meb.gov.tr" target="_blank" rel="noreferrer">
                e-Okul <span className={styles.ext}>↗</span>
            </a>
            </div>
        </div>
        </div>

        <div className={styles.footerBottom}>
        <span>© {new Date().getFullYear()} Cengiz Eğitim Kurumu</span>
        <span className={styles.footerSep}>•</span>
        <span className={styles.footerMini}>Tüm hakları saklıdır.</span>
        </div>
    </Container>
    </footer>)
};
