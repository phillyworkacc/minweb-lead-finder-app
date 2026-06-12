'use client'
import AppWrapper from "../AppContainer/AppContainer";
import LoadingCard from "@/components/Card/LoadingCard";
import Spacing from "@/components/Spacing/Spacing";

export default function LoadingPageComponent () {
   return (
      <AppWrapper>
         <Spacing size={1} />
         {Array.from({ length: 3 }, (_, i) => i+1).map((value, index) => (
            <div className='box full' key={index}>
               <LoadingCard styles={{
                  width: "100%",
                  height: "150px"
               }} />
               <Spacing size={1} />
            </div>
         ))}
      </AppWrapper>
   )
}
