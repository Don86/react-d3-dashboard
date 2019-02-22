import React from "react"

class Card extends React.Component {
    render() {
        return(
            <div>
                <button>Select index</button>

                <div className="menu">
                <button>SPY</button>
                <button>VTSAX</button>
                <button>VOO</button>
                </div>
            </div>
        )
    }
}

export default StockMenuCard