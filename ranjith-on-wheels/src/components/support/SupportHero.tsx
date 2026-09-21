import Image from "next/image";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Eyebrow } from "@/components/ui/Eyebrow";
import styles from "./SupportHero.module.css";

export function SupportHero() {
  return (
    <section className={styles.hero}>
      <div className={styles.imageWrap}>
        <Image
          src="/media/support/hero.jpg"
          alt="Ranjith standing with his loaded touring bicycle on a snow-lined road"
          fill
          priority
          sizes="100vw"
          className={styles.image}
        />
      </div>
      <div className={styles.gradient} aria-hidden="true" />
      <div className={styles.content}>
        <Eyebrow>Support the road ahead</Eyebrow>
        <h1 className={styles.headline}>Help the next kilometre happen.</h1>
        <p className={styles.lede}>
          Every contribution helps keep the bicycle moving, the camera recording and the next
          story possible.
        </p>
        <div className={styles.actions}>
          <ButtonLink href="#support-options">Choose your support</ButtonLink>
          <ButtonLink href="#where-support-goes" variant="secondary">
            How support is used
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
