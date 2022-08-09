import { useForm } from "react-hook-form";
import Button from "./Button";
import { useState } from "react";
import './BatchForm.css';
import { BTN_COLOR, TOPPINGS } from "../App.constants";

export type Batch = { [toppings: string]: string[] }[]

type BatchFormProps = {
    onSubmit: (batch: Batch) => void;
}

export default function BatchForm({ onSubmit }: BatchFormProps) {
    const { register, handleSubmit, unregister, setValue } = useForm();

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
        unregister();
        setValue('toppings', []);
    };

    return (
        <div>
            {
                curBatch.length ?
                    <div>
                        <h5 style={{marginLeft: '50px', marginBottom: '20px'}}>Current Orders Batch:</h5>
                        <div className='scrollable-div'>
                            <ol>
                                {
                                    curBatch.map((order, i) =>
                                        <li key={`li${i}`}>
                                            {order["toppings"].length ? 'Pizza with: ' + order["toppings"].join(", ") : "Plain pizza (no toppings)"}
                                        </li>
                                    )
                                }
                            </ol>
                        </div>
                    </div>
                    : 'No pizza orders in the batch yet...'
            }
            <h6 style={{ textAlign: 'center', marginTop: '20px' }}>Choose toppings for a new pizza order:</h6>
            <form className="form" onSubmit={handleSubmit(onOrderAdd)}>
                {
                    TOPPINGS.map((topping, i) => {
                        return (
                            <label key={`label${i}`}>
                                <input key={topping}
                                    {...register("toppings")}
                                    type="checkbox"
                                    value={topping}
                                />
                                {topping}
                            </label>
                        );
                    })
                }
                <input type="submit" value="Add pizza to batch" />
            </form>
            <div style={{ textAlign: "center" }}>
                <Button color={BTN_COLOR} text={"Send orders batch to the restaurant"} onClick={() => onSubmit(curBatch)} />
            </div>
        </div>
    );
}
