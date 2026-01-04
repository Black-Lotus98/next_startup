"use client"
import SpaceInvadersLayout from '@/components/layouts/SpaceInvadersLayout'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const TaxesPage = () => {
  const router = useRouter()
  const [countryTax, setCountryTax] = useState(0)
  const [salesTax, setSalesTax] = useState(0)
  const [incomeTax, setIncomeTax] = useState(0)
  const [selectedValue, setSelectedValue] = useState(100)
  return (
    <SpaceInvadersLayout href="/space-invaders/main-menu" className="font-alien-robot" gap="0">
      <div className="text-2xl font-bold text-center row-span-1 col-span-12">
        <h2>Country Revenue</h2>
      </div>
      <div className="text-xl row-span-1 col-span-12">
        <h4 className='text-center'>Percent Levied Last Year:</h4>
        <div className="prev">
          <output className="prevInfo" />
          {(countryTax + salesTax + incomeTax) % 100}%
        </div>
      </div>
      <div className="text-center row-span-1 col-span-12">
        <h4 className='text-center'>Customs Duty:</h4>
      </div >
      <div className="currentCustoms">
        <output className="prevCustoms newCountryTax" />
        {countryTax}%
      </div>
      <div className="currentCustoms">

      </div>
      <div className="salesTax row-span-1 col-span-12">
        <h4 className='text-center'>Sales Tax:</h4>
      </div>
      <div className="currentSalesT">
        <output className="prevSales newSales" />
        {salesTax}%
      </div >

      <div className="incomeTax row-span-1 col-span-12">
        <h4>Income Tax:</h4>
      </div>
      <div className="currentIncome">
        <output className="prevIncome newIncome" />
        {incomeTax}%
      </div >
      <div className="justice row-span-1 col-span-12">
        <h4>Justice:</h4>
      </div>
      <div className="currentJustice">
        <output className="selectedJustice">{selectedValue}%</output>
      </div>
      <p>
        Indicate Tax to Change or Press &quot;Continue&quot; to move on
      </p>
      <div className="newCustoms row-span-1 col-span-12">
        <h4>Customs Duty:</h4>
      </div>
      <div className="updateCustoms row-span-1 col-span-12">
        <input
          className="newCountryTax"
          value={countryTax}
          onChange={(e) => setCountryTax(Number(e.target.value))}
        />
      </div >
      <div className="newSalesTax row-span-1 col-span-12">
        <h4>Sales Tax:</h4>
      </div>
      <div className="updateSales row-span-1 col-span-12">
        <input
          className="newSales"
          value={salesTax}
          onChange={(e) => setSalesTax(Number(e.target.value))}
        />
      </div >
      <div className="newIncomeTax row-span-1 col-span-12">
        <h4>Income Tax:</h4>
      </div>
      <div className="updateIncomeTax row-span-1 col-span-12">
        <input
          className="newIncome"
          value={incomeTax}
          onChange={(e) => setIncomeTax(Number(e.target.value))}
        />
      </div >
      <div className="newJustice">
        <h4>Justice:</h4>
      </div>
      <div className="updateJustice">
        <select className="newJustice">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
      </div>
      <button className="continue-btn" onClick={() => router.push('/space-invaders/main-menu')}>
        Continue
      </button>
    </SpaceInvadersLayout>
  )
}

export default TaxesPage
