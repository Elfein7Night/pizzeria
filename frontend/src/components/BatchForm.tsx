import { useForm } from "react-hook-form";
import Button from "./Button";
import { useState } from "react";
import './BatchForm.css';
import { TOPPINGS } from "../App.constants";

export type Batch = { [toppings: string]: string[] }[]

type BatchFormProps = {
    onSubmit: (batch: Batch) => void;
}

export default function BatchForm({ onSubmit }: BatchFormProps) {
    const { register, handleSubmit, unregister } = useForm();

    const [curBatch, setCurBatch] = useState<Batch>(
        []
    );

    const onOrderAdd = (data: { [toppings: string]: string[] }) => {
        if (!data || !data['toppings']) {
            data = {
                toppings: []
            }
        }
        setCurBatch([...curBatch, data]);
        unregister('toppings');
    };

    return (
        <div>
            <h4>Current Batch Orders:</h4>
            <ol>
                {
                    curBatch.map((order, i) =>
                        <li key={`li${i}`}>
                            {order["toppings"].length ? order["toppings"].toString() : "order with no toppings"}
                        </li>
                    )
                }
            </ol>
            <form className="form" onSubmit={handleSubmit(onOrderAdd)}>
                {TOPPINGS.map((topping, i) => {
                    return (
                        <label key={`label${i}`}>
                            <input key = {`input${i}`}
                                {...register("toppings")}
                                type="checkbox"
                                value={topping}
                            />{" "}
                            {topping}
                        </label>
                    );
                })}
                <input type="submit" />
            </form>
            <Button color={"green"} text={"Order this batch from the restaurant"} onClick={() => onSubmit(curBatch)} />
        </div>
    );
}
