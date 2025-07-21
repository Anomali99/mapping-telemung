import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    getHamletBoundaries,
    getPolylines,
    getUMKMPoints,
    getVillageBoundary,
    getVisitedDate,
    parseCustomDate,
    type BoundaryType,
    type PointType,
} from "@/data";
import MapComponent from "@/components/MapComponent";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { id } from "date-fns/locale";

function App() {
    const villageBoundary = [getVillageBoundary()];
    const hamletBoundaries = getHamletBoundaries();
    const hamletList = hamletBoundaries.map((item) => item.name);
    const umkmPoints = getUMKMPoints();
    const categories = [...new Set(umkmPoints.map((item) => item.category))];
    const visited = getVisitedDate();
    const [activeTab, setActiveTab] = useState<"village" | "hamlet">("village");
    const [theme, setTheme] = useState<string>("default");
    const [category, setCategory] = useState<string>("all");
    const [hamlets, setHamlets] = useState<BoundaryType[]>(hamletBoundaries);
    const [points, setPoints] = useState<PointType[]>(umkmPoints);
    const [selectedHamlets, setSelectedHamlets] =
        useState<string[]>(hamletList);
    const [polylines, setPolylines] = useState<[number, number][]>([]);
    const [date, setDate] = useState<string>("none");

    const setHamlet = (checked: boolean, value: string) => {
        if (checked) {
            setSelectedHamlets((prev) => [...prev, value]);
        } else {
            setSelectedHamlets((prev) => prev.filter((item) => item !== value));
        }
    };

    const filterPoints = () => {
        const filterPoints =
            activeTab === "village"
                ? umkmPoints
                : umkmPoints.filter((item) =>
                      selectedHamlets.includes(item.hamlet)
                  );

        setPoints(
            category === "all"
                ? filterPoints
                : category === "none"
                  ? []
                  : filterPoints.filter((item) => item.category === category)
        );
    };

    useEffect(() => {
        if (date !== undefined)
            setPolylines([[-8.138815, 114.313818], ...getPolylines(date)]);
        else setPolylines([]);
        console.log(date);
    }, [date]);

    useEffect(() => {
        if (activeTab === "village") {
            setPoints(umkmPoints);
        } else {
            setHamlets(
                hamletBoundaries.filter((item) =>
                    selectedHamlets.includes(item.name)
                )
            );
        }
        filterPoints();
    }, [selectedHamlets, activeTab]);

    useEffect(() => {
        filterPoints();
    }, [category, activeTab]);

    return (
        <section className="relative h-[100dvh] w-[100dvw]">
            <Tabs
                className="absolute top-0 right-0 z-10 p-4"
                defaultValue="village"
                onValueChange={(val) =>
                    setActiveTab(val as "village" | "hamlet")
                }
            >
                <div className="flex w-max flex-col items-end gap-4 bg-white p-2 lg:flex-row-reverse lg:items-center">
                    <div className="flex w-max flex-row-reverse gap-4">
                        <TabsList>
                            <TabsTrigger value="village">Desa</TabsTrigger>
                            <TabsTrigger value="hamlet">Dusun</TabsTrigger>
                        </TabsList>

                        <Select
                            defaultValue="default"
                            onValueChange={setTheme}
                            value={theme}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Theme" />
                            </SelectTrigger>
                            <SelectContent className="">
                                <SelectItem value="default">Default</SelectItem>
                                <SelectItem value="satellite">
                                    Satellite
                                </SelectItem>
                                <SelectItem value="dark">Dark</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select
                            defaultValue="all"
                            onValueChange={setCategory}
                            value={category}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent className="">
                                <SelectItem value="all">Semua</SelectItem>
                                <SelectItem value="none">
                                    Tidak Semua
                                </SelectItem>
                                {categories.map((item, index) => (
                                    <SelectItem key={index} value={item}>
                                        {item}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            defaultValue="none"
                            onValueChange={setDate}
                            value={date}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Pilih Tanggal" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">
                                    Tidak Semua
                                </SelectItem>
                                {visited.map((item, index) => {
                                    const parseItem = parseCustomDate(item);
                                    return (
                                        <SelectItem key={index} value={item}>
                                            {format(
                                                parseItem,
                                                "EEEE, dd MMMM yyyy",
                                                { locale: id }
                                            )}
                                        </SelectItem>
                                    );
                                })}
                            </SelectContent>
                        </Select>
                    </div>
                    {activeTab === "hamlet" && (
                        <div className="flex w-max flex-row items-center justify-center gap-3 rounded-md bg-gray-200 px-3 py-2">
                            {hamletList.map((item) => (
                                <div className="flex flex-row gap-2" key={item}>
                                    <Checkbox
                                        className="bg-white"
                                        id={item}
                                        checked={selectedHamlets.includes(item)}
                                        onCheckedChange={(checked) => {
                                            setHamlet(Boolean(checked), item);
                                        }}
                                    />
                                    <Label htmlFor={item}>{item}</Label>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Tabs>
            <MapComponent
                theme={theme as "default" | "satellite" | "dark"}
                center={[-8.116056, 114.288972]}
                points={points}
                polylines={polylines}
                polygons={activeTab === "village" ? villageBoundary : hamlets}
            />
        </section>
    );
}

export default App;
