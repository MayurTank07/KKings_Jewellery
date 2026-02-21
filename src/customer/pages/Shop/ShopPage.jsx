"use client"

import React from 'react'
import { useParams, Link } from 'react-router-dom'
import HomeSectionCard from '../../components/HomeSectionCard/HomeSectionCard'
import { bracelets } from '../../data/bracelet'
import { chains } from '../../data/chains'
import { rings } from '../../data/rings'
import { pendals } from '../../data/pendals'
import { bali } from '../../data/bali'
import { kada } from '../../data/kada'
import { rudraksh } from '../../data/rudraksh'

export default function ShopPage() {
  const { category } = useParams() || {}
  const cat = category ? category.toLowerCase() : null

  const all = [...bracelets, ...chains, ...rings, ...pendals, ...bali, ...kada, ...rudraksh]

  let products = all
  if (cat) {
    if (cat.includes('bracelet')) products = bracelets
    else if (cat.includes('chain')) products = chains
    else if (cat.includes('ring')) products = rings
    else if (cat.includes('pendal') || cat.includes('pendals')) products = pendals
    else if (cat.includes('bali')) products = bali
    else if (cat.includes('kada')) products = kada
    else if (cat.includes('rudraksh')) products = rudraksh
    else products = all
  }

  const title = cat ? cat.replace(/-/g, ' ').replace(/\b\w/g, (s) => s.toUpperCase()) : 'All Products'

  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-2xl font-semibold mb-6">{title}</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <Link key={p.id} to={`/product/${p.id}`}>
              <HomeSectionCard product={p} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
