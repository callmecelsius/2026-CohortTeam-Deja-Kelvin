import React, { useState, useEffect } from 'react'
import { getAnimalByFosterId } from "@/api/mypets";
import { PetDetailCard } from "@/components/fosterparent/PetDetailCard";
import type { Animal } from "../../../types/animalType";
import useGlobalContext from "@/hooks/useGlobalContext";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

const MyPets = () => {
    const { user } = useGlobalContext();
    const fosterHomeId = user?.fosterParent?.fosterHomeId;
    console.log("Foster Home ID:", fosterHomeId);
    const [animals, setAnimals] = useState<Animal[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const animalsPerPage = 2;

    useEffect(() => {
        async function fetchFosterAnimals() {
            if (!fosterHomeId) {
                setLoading(false);
                return;
            }
            try {
                const data = await getAnimalByFosterId(fosterHomeId);
                setAnimals(data)
            } catch {
                setError(true);
            } finally {
                setLoading(false);
            }
        }

        fetchFosterAnimals();
    }, [fosterHomeId])

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Failed to load pets.</p>;
    if (animals.length === 0) return <p>No pets found.</p>;

    const indexOfLast = currentPage * animalsPerPage;
    const indexOfFirst = indexOfLast - animalsPerPage;
    const currentAnimals = animals.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(animals.length / animalsPerPage);
   

    return (
        <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {currentAnimals.map((animal) => (
                    <PetDetailCard key={animal.id} animal={animal} />
                ))}
            </div>

            <Pagination className="mt-6">
                <PaginationContent>

                    <PaginationItem>
                        <PaginationPrevious
                            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                    </PaginationItem>

                    {Array.from({ length: totalPages }, (_, index) => (
                        <PaginationItem key={index}>
                            <PaginationLink
                                isActive={currentPage === index + 1}
                                onClick={() => setCurrentPage(index + 1)}
                            >
                                {index + 1}
                            </PaginationLink>
                        </PaginationItem>
                    ))}

                    <PaginationItem>
                        <PaginationNext
                            onClick={() =>
                                currentPage < totalPages && setCurrentPage(currentPage + 1)
                            }
                            className={
                                currentPage === totalPages
                                    ? "pointer-events-none opacity-50"
                                    : ""
                            }
                        />
                    </PaginationItem>

                </PaginationContent>
            </Pagination>

        </div >
    )
}

export default MyPets
