/* eslint-disable react/prop-types */
import { Component } from "react";

class Brush extends Component {
    constructor(props) {
        super(props);
        this.state = {
            color: props.color,
            size: props.size
        }
    }
}
export default Brush;
