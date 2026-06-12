'use client'

type SpacingProps = {
   size?: number;
}

export default function Spacing({ size }: SpacingProps) {
   return <>
      {Array.from({ length: size || 1 }, (_, i) => i + 1).map((count, index) => {
         return <br key={index} />
      })}
   </>
}
