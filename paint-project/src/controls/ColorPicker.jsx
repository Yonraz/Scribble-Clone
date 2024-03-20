/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import { SketchPicker } from 'react-color'
import './ColorPicker.css'
const ColorPicker = (props) => {
    const [color, setColor] = useState('#000000')

    const handleColorChange = (c) => {
        setColor(c)
    }
    useEffect(() => {
        props.sendColor(color);
    }, [color])
    return (
        <div className="color-picker">
        
        <SketchPicker
            id="color-picker"
            color={color}
            disableAlpha={true}
            onChange={(c) => handleColorChange(c.hex)}
        />
        <label htmlFor="color-picker">Color</label>
        </div>
    )
}
export default ColorPicker;