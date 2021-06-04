interface Alert {
    readonly id: string;
    readonly coinId: string;
    readonly operand: string;
    readonly amount: number;
}

export default Alert;
