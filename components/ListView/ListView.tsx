'use client'
import "./ListView.css"

type ListViewProps = {
   items: any[];
   itemDisplayComponent: (item: any) => React.ReactNode;
}

export default function ListView ({ items, itemDisplayComponent }: ListViewProps) {
   return (
      <div className="list-view">
         {items.map((item, index) => {
            return <div key={index} className="list-view-item">{itemDisplayComponent(item)}</div>
         })}
      </div>
   )
}
