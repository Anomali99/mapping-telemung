import villageBoundaries from "./villageBoundaries.json";
import umkmPoints from "./umkmPoints.json";

export interface BoundaryType {
    name: string;
    color: string;
    boundary: [number, number][];
}

export interface PointType {
    name: string;
    description: string;
    hamlet: string;
    category: string;
    icon: string;
    position: [number, number];
    visited: {
        date: string;
        order: number;
    }[];
}

export function getVillageBoundary() {
    return villageBoundaries[0] as BoundaryType;
}
export function getHamletBoundaries() {
    return villageBoundaries.slice(1) as BoundaryType[];
}

export function getUMKMPoints() {
    return umkmPoints as PointType[];
}

export function getPolylines(date: string) {
    const result: { order: number; position: [number, number] }[] = [];

    getUMKMPoints().forEach((point) => {
        point.visited.forEach((time) => {
            if (time.date === date) {
                result.push({ order: time.order, position: point.position });
            }
        });
    });

    result.sort((a, b) => a.order - b.order);
    return result.map((item) => item.position);
}

export function getVisitedDate() {
    const visitedDate = new Set<string>();

    getUMKMPoints().forEach((point) =>
        point.visited.forEach((visited) => visitedDate.add(visited.date))
    );

    return [...visitedDate];
}

export function parseCustomDate(dateStr: string): Date {
    const [day, month, year] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day);
}
