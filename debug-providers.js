const API_KEY = "f3a3f66b6f9697a5a908d86c607ba115";
const API_URL = "https://api.themoviedb.org/3";
const FALLOUT_ID = 106379;

async function checkProviders() {
    try {
        console.log("--- TEST 1: append_to_response ---");
        const url1 = `${API_URL}/tv/${FALLOUT_ID}?api_key=${API_KEY}&language=it-IT&append_to_response=watch_providers`;
        const res1 = await fetch(url1);
        const data1 = await res1.json();
        console.log("Keys in response:", Object.keys(data1));
        if (data1.watch_providers) {
            console.log("watch_providers keys:", Object.keys(data1.watch_providers));
            console.log("Results keys:", data1.watch_providers.results ? Object.keys(data1.watch_providers.results) : "No results");
        } else {
            console.log("watch_providers is MISSING in append_to_response");
        }

        console.log("\n--- TEST 2: Dedicated Endpoint ---");
        const url2 = `${API_URL}/tv/${FALLOUT_ID}/watch/providers?api_key=${API_KEY}`;
        const res2 = await fetch(url2);
        const data2 = await res2.json();
        console.log("Dedicated Endpoint Keys:", Object.keys(data2));
        if (data2.results) {
            console.log("Dedicated Results Keys:", Object.keys(data2.results));
            if (data2.results.IT) {
                console.log("IT Providers:", JSON.stringify(data2.results.IT, null, 2));
            } else {
                console.log("No IT providers found in dedicated endpoint.");
            }
        }

    } catch (error) {
        console.error("Error:", error);
    }
}

checkProviders();
