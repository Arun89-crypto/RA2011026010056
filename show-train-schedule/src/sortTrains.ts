interface TrainInterface {
  trainName: string;
  trainNumber: number;
  departureTime: departureTimeInterface;
  seatAvailable: seatsInterface;
  price: priceInterface;
  delayedBy: number;
}

interface departureTimeInterface {
  Hours: number;
  Minutes: number;
  Seconds: number;
}

interface priceInterface {
  sleeper: number;
  AC: number;
}

interface seatsInterface {
  sleeper: number;
  AC: number;
}

class PriorityQueue<TrainInterface> {
  private items: TrainInterface[];
  constructor(
    private compareFn: (a: TrainInterface, b: TrainInterface) => number
  ) {
    this.items = [];
  }
  enqueue(item: TrainInterface): void {
    this.items.push(item);
    this.items.sort(this.compareFn);
  }
  dequeue(): TrainInterface | undefined {
    return this.items.shift();
  }
  size(): number {
    return this.items.length;
  }
}

export const compareTrains = (a: TrainInterface, b: TrainInterface): number => {
  const now = Math.round(Date.now() / 1000);
  const a_dep_time = decodeTime(a.departureTime);
  const b_dep_time = decodeTime(b.departureTime);

  const aDepartureTime = a_dep_time > now ? a_dep_time : now;
  const bDepartureTime = b_dep_time > now ? b_dep_time : now;

  if (aDepartureTime === bDepartureTime) {
    const a_price = getAveragePrice(a.price);
    const b_price = getAveragePrice(b.price);
    if (a_price === b_price) {
      return getTotalSeats(b.seatAvailable) - getTotalSeats(a.seatAvailable);
    } else {
      return a_price - b_price;
    }
  } else {
    return aDepartureTime - bDepartureTime;
  }
};

export const decodeTime = (date: departureTimeInterface): number => {
  return date.Hours * 3600 + date.Minutes * 60 + date.Seconds;
};

export const getAveragePrice = (price: priceInterface): number => {
  return (price.AC + price.sleeper) / 2;
};

export const getTotalSeats = (seats: seatsInterface): number => {
  return seats.AC + seats.sleeper;
};

export const sortTrainsWithConditions = (trains: TrainInterface[]) => {
  const sortedTrains = [];
  const queue = new PriorityQueue<TrainInterface>(compareTrains);
  const now = Date.now();
  trains.forEach((train) => {
    if (
      decodeTime(train.departureTime) > now &&
      decodeTime(train.departureTime) - now > 30 * 60 * 1000
    )
      queue.enqueue(train);
  });
  while (queue.size() > 0) {
    sortedTrains.push(queue.dequeue());
  }

  return sortedTrains;
};
