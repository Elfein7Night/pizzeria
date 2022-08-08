export const NUM_OF_TOPPINGS_PER_CHEF = 2;

export const enum Station {
    DOUGH = 'DOUGH',
    TOPPING = 'TOPPING',
    OVEN = 'OVEN',
    WAITER = 'WAITER',
}

export const NEXT_STATION = {
    [Station.DOUGH]: Station.TOPPING,
    [Station.TOPPING]: Station.OVEN,
    [Station.OVEN]: Station.WAITER,
};

export const MAX_ACTIVE_FOR_STATION = {
    [Station.DOUGH]: 2,
    [Station.TOPPING]: 3,
    [Station.OVEN]: 1,
    [Station.WAITER]: 2,
};

export const TIME_FOR_STATION_MS = {
    [Station.DOUGH]: 7000,
    [Station.TOPPING]: 4000,
    [Station.OVEN]: 10000,
    [Station.WAITER]: 5000,
};

export const TASK_IN_QUEUE = 'TASK_IN_QUEUE';
export const TASK_COMPLETE = 'TASK_COMPLETE';
export const BATCH_COMPLETE = 'BATCH_COMPLETE';
