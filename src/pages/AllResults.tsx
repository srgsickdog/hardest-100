import { useEffect, useState } from "react";
import { getAllResults } from "../firebase/firebaseFunctions";
import PersonResult from "../components/PersonResult";
import { SimpleGrid } from "@chakra-ui/react";

interface AllResultsProps {
  accessToken: string;
}

const AllResults: React.FC<AllResultsProps> = ({ accessToken }) => {
  const [loading, setLoading] = useState(true);
  const [allResults, setAllResults] = useState([]);

  const handleGetAllResults = async () => {
    const response = await getAllResults();
    setAllResults(response);
    setLoading(false);
  };

  useEffect(() => {
    handleGetAllResults();
  }, []);

  return (
    <>
      {!loading && (
        <SimpleGrid padding={2} columns={2} spacing={4}>
          {allResults.map((result: any) => (
            <PersonResult
              personResult={result}
              key={result.personName}
              accessToken={accessToken}
            />
          ))}
        </SimpleGrid>
      )}
    </>
  );
};

export default AllResults;
