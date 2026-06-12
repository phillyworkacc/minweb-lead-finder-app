'use client'
import "./CardView.css"

type CardViewProps = {
   items: any[];
   itemDisplayComponent: (item: any) => React.ReactNode;
}

export default function CardView ({ items, itemDisplayComponent }: CardViewProps) {
   return (
      <div className="card-view">
         {items.map((item, index) => {
            return <div key={index} className="card-view-item">{itemDisplayComponent(item)}</div>
         })}
      </div>
   )
}
