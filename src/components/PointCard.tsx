import type { PointType } from "@/data";
import React from "react";
import { Store, Coffee, Leaf, Factory, Hammer, Shirt } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

interface PointCardProps {
    point: PointType;
}
const BadgeColor: Record<string, string> = {
    Telemungsari: "#43A047",
    Krajan: "#F4511E",
    Wonosuko: "#8E24AA",
    Watugepeng: "#FB8C00",
    Gedor: "#E53935",
};

const CategoryIcon: Record<string, React.ReactNode> = {
    store: <Store />,
    coffee: <Coffee />,
    leaf: <Leaf />,
    factory: <Factory />,
    hammer: <Hammer />,
    shirt: <Shirt />,
};

const PointCard: React.FC<PointCardProps> = ({ point }) => {
    return (
        <Card className="m-0 border-0 p-0 shadow-none">
            <CardHeader className="p-0">
                <CardTitle className="flex flex-row justify-between">
                    {point.name}
                    <span className="flex flex-row gap-2">
                        {point.category !== "" && (
                            <Badge>
                                {CategoryIcon[point.icon]}
                                {point.category}
                            </Badge>
                        )}
                        <Badge
                            style={{
                                backgroundColor: BadgeColor[point.hamlet],
                            }}
                        >
                            {point.hamlet}
                        </Badge>
                    </span>
                </CardTitle>
                <CardDescription>
                    {point.description !== ""
                        ? point.description
                        : "Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem assumenda excepturi neque suscipit eveniet, blanditiis cupiditate temporibus commodi eum eius?"}
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 p-0">
                {/* <Badge variant="default" className="w-full">
                    Jum'at, 4 Juli 2025 10:30 WIB
                </Badge> */}
            </CardContent>
        </Card>
    );
};

export default PointCard;
