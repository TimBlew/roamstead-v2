import { HeroSection } from '@/components/sections/HeroSection'
import { ValueStatement } from '@/components/sections/ValueStatement'
import { ValueCards } from '@/components/sections/ValueCards'
import { FeaturedHomes } from '@/components/sections/FeaturedHomes'
import { CommunityCTA } from '@/components/sections/CommunityCTA'

export default function Home() {
  return (
    <>
      <HeroSection />
      <ValueStatement />
      <ValueCards />
      <FeaturedHomes />
      <CommunityCTA />
    </>
  )
}
