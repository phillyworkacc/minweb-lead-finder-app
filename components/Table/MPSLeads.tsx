'use client'
import './Table.css'
import { useState } from 'react';
import { useModal } from '../Modal/ModalContext';
import { leadCardItemEllipsis } from '@/machine/helpers';
import { formatMilliseconds } from '@/utils/date';
import Card from '../Card/Card';
import Spacing from '../Spacing/Spacing';
import MPSListingsCardView from '@/modals/MPSListingsCardView';

type MPSLeadsProps = {
   listings: MPSListing[];
}

export default function MPSLeads ({ listings }: MPSLeadsProps) {
   const { showMassiveModal } = useModal();
   const [allListings, setAllListings] = useState<MPSListing[]>(listings);
   const [searchListings, setSearchListings] = useState('');

   const applyFilters = (listings: MPSListing[]): MPSListing[] => {
      return listings
         .filter(listing => (
            listing.name.toLowerCase().includes(searchListings.toLowerCase()) ||
            listing.description.toLowerCase().includes(searchListings.toLowerCase())
         )) // search filter
   }

   const leadCardStyle: React.CSSProperties = {
      padding: "25px", width: "100%",
      maxWidth: "550px"
   }

   function openFilteredAutoLeadsView (listing: MPSListing) {
      showMassiveModal({
         content: <MPSListingsCardView 
            listings={applyFilters(allListings)} 
            currentListingIndex={applyFilters(allListings).indexOf(listing)}
         />
      })
   }

   return (
      <>
         <div className="box full mb-1 mt-1">
            <div className='box full dfb column'>
               <div className="box full dfb align-center gap-5 pd-05">
                  <input
                     type="text"
                     className="xxxs full pd-12 pdx-2 tiny-shadow"
                     placeholder='Search Listings...'
                     value={searchListings}
                     onChange={e => setSearchListings(e.target.value)}
                  />
               </div>
            </div>
            {(searchListings !== '') && (<div className="box full mb-05">
               <div className="text-xxxs full grey-4 mb-05">
                  After filters, {applyFilters(allListings).length} listing(s) found
               </div>
            </div>)}
         </div>
         <div className="box full dfb wrap gap-10">
            {applyFilters(allListings).map((listing, index) => (
               <Card key={index} cursor styles={leadCardStyle} onClick={() => openFilteredAutoLeadsView(listing)}>
                  <div className="box full">
                     <div className="text-xs full bold-600 mb-05">{listing.name}</div>
                     <div className="text-xxxs full grey-5 pd-05">{leadCardItemEllipsis(listing.description!)}</div>
                     <div className="text-t full grey-5 pd-05">{formatMilliseconds(new Date(listing.createdAt).getTime(), false, true)}</div>
                  </div>
               </Card>
            ))}
         </div>
         <Spacing size={3} />
      </>
   )
}
