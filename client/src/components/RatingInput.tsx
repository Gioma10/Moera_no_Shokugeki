import { StarIcon } from "lucide-react"

export const RatingInput = ()=>{
    return (
        <div className="flex">
            {Array.from({length: 5}, ()=> {
                return (
                    <StarIcon />
                )
            })

    }
        </div>
    )
}