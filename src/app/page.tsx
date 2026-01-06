import Link from 'next/link';

import { TreeIcon } from '@/components/icons/tree';
import homeStyles from './home.module.css';
import { FlowerIcon } from '@/components/icons/flower';
import { GrassIcon } from '@/components/icons/grass';
import { BirdIcon } from '@/components/icons/bird';
import { ReptileIcon } from '@/components/icons/reptile';
import { AmphibianIcon } from '@/components/icons/amphibian';
import { FishIcon } from '@/components/icons/fish';
import { ArthropodIcon } from '@/components/icons/arthropod';
import { MammalIcon } from '@/components/icons/mammal';
import { TrackIcon } from '@/components/icons/track';
import { ShuffleIcon } from '@/components/icons/shuffle';

export default async function Home() {
  return (
    <main className={homeStyles.main}>
      <h1 className={homeStyles.header}>Wildlife Quiz</h1>

      <nav className={homeStyles.nav} aria-labelledby="nav-title">
        <h2 id="nav-title">Individual sections</h2>
        <ul className={homeStyles.linkList}>
          <li>
            <Link href="/quiz/trees" className={homeStyles.pageLink}>
              <TreeIcon /> Trees
            </Link>
          </li>
          <li>
            <Link href="/quiz/flowers" className={homeStyles.pageLink}>
              <FlowerIcon /> Flowers
            </Link>
          </li>
          <li>
            <Link href="/quiz/grasses" className={homeStyles.pageLink}>
              <GrassIcon /> Grasses
            </Link>
          </li>
          <li>
            <Link href="/quiz/birds" className={homeStyles.pageLink}>
              <BirdIcon /> Birds Pictures
            </Link>
          </li>
          <li>
            <Link href="/quiz/birds-sounds" className={homeStyles.pageLink}>
              <BirdIcon /> Birds Sounds
            </Link>
          </li>
          <li>
            <Link href="/quiz/birds-nests" className={homeStyles.pageLink}>
              <BirdIcon /> Birds Nests
            </Link>
          </li>
          <li>
            <Link href="/quiz/reptiles" className={homeStyles.pageLink}>
              <ReptileIcon /> Reptiles
            </Link>
          </li>
          <li>
            <Link href="/quiz/amphibians" className={homeStyles.pageLink}>
              <AmphibianIcon /> Amphibians Pictures
            </Link>
          </li>
          <li>
            <Link
              href="/quiz/amphibians-sounds"
              className={homeStyles.pageLink}
            >
              <AmphibianIcon /> Amphibians Sounds
            </Link>
          </li>
          <li>
            <Link href="/quiz/fish" className={homeStyles.pageLink}>
              <FishIcon /> Fish
            </Link>
          </li>
          <li>
            <Link href="/quiz/arthropods" className={homeStyles.pageLink}>
              <ArthropodIcon /> Arthropods
            </Link>
          </li>
          <li>
            <Link href="/quiz/mammals" className={homeStyles.pageLink}>
              <MammalIcon /> Mammals Pictures
            </Link>
          </li>
          <li>
            <Link href="/quiz/mammals-sounds" className={homeStyles.pageLink}>
              <MammalIcon /> Mammals Sounds
            </Link>
          </li>
          <li>
            <Link href="/quiz/tracks" className={homeStyles.pageLink}>
              <TrackIcon /> Tracks
            </Link>
          </li>
          <li>
            <Link href="/custom" className={homeStyles.pageLink}>
              <ShuffleIcon /> Custom
            </Link>
          </li>
          <li>
            <Link href="/random" className={homeStyles.pageLink}>
              <ShuffleIcon /> Randomise all
            </Link>
          </li>
        </ul>
      </nav>
    </main>
  );
}
