'use client'

import { memo, lazy, Suspense, useEffect, useState } from 'react'
import MainCarosal from '../../components/HomeCarosal/MainCarosal'
import HomeSectionCarosal from '../../components/HomeSectionCarosal/HomeSectionCarosal'
import { chains } from '../../data/chains'
import { bracelets } from '../../data/bracelet'
import { rings } from '../../data/rings'
import { kada } from '../../data/kada'
import { bali } from '../../data/bali'
import { pendals } from '../../data/pendals'
import { rudraksh } from '../../data/rudraksh'
import { getContent, DEFAULT_CONTENT } from '../../../utils/contentStorage'

// Lazy-load non-critical sections
const LazyHomeSection = lazy(() =>
  import('../../components/HomeSectionCarosal/HomeSectionCarosal')
)

// ================= DATA =================
  const allProducts = [...chains, ...bracelets, ...rings, ...kada, ...bali, ...pendals, ...rudraksh]

function HomePage() {
  const [content, setContent] = useState(DEFAULT_CONTENT.homePage)

  useEffect(() => {
    const homeContent = getContent('HOME_PAGE')
    if (homeContent) {
      setContent(homeContent)
    }
  }, [])

  // Helper function to get products by section name
  const getProductsBySection = (sectionId) => {
    if (sectionId.includes('chain')) return chains
    if (sectionId.includes('brace')) return bracelets
    if (sectionId.includes('ring')) return rings
    if (sectionId.includes('kada')) return kada
    if (sectionId.includes('bali')) return bali
    if (sectionId.includes('pendal')) return pendals
    if (sectionId.includes('rudraksh')) return rudraksh
    return allProducts
  }

  return (
    <div className="mt-0">
      {/* ================= HERO (Critical) ================= */}
      <MainCarosal />

      {/* ================= SECTIONS ================= */}
      <div className="space-y-10 py-20 flex flex-col justify-center px-5 lg:px-10">

        {/* Above-the-fold sections (eager) */}
        {content.sections.slice(0, 2).map((section) => (
          <HomeSectionCarosal 
            key={section.id}
            data={getProductsBySection(section.id)} 
            sectionName={section.name} 
          />
        ))}

        {/* Below-the-fold sections (lazy) */}
        <Suspense fallback={null}>
          {content.sections.slice(2).map((section) => (
            <LazyHomeSection 
              key={section.id}
              data={getProductsBySection(section.id)} 
              sectionName={section.name} 
            />
          ))}
        </Suspense>
      </div>

      {/* Footer moved to App-level router */}
    </div>
  )
}

export default memo(HomePage)
