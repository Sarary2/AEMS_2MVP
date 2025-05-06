export async function fetchDeviceRecalls(limit = 25) {
    try {
      const res = await fetch(
        `https://api.fda.gov/device/enforcement.json?search=product_type:Device&limit=${limit}`
      );
  
      const data = await res.json();
  
      if (!data || !data.results) {
        console.warn("⚠️ OpenFDA API returned no results:", data);
        return [];
      }
  
      return data.results.map(item => ({
        brandName: item.device_name || item.product_description || 'Unknown',
        recallReason: item.reason_for_recall || 'N/A',
        recallDate: item.recall_initiation_date || 'N/A',
        status: item.status || 'N/A',
        recallNumber: item.recall_number || '',
      }));
    } catch (err) {
      console.error('❌ Error fetching recall data:', err);
      return [];
    }
  }
  