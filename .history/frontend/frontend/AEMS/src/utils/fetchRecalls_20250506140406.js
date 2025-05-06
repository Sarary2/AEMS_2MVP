export async function fetchDeviceRecalls(limit = 10) {
    try {
      const res = await fetch(`https://api.fda.gov/device/enforcement.json?search=product_type:Device&limit=${limit}`);
      const data = await res.json();
      return data.results.map(item => ({
        brandName: item.device_name || 'Unknown',
        recallReason: item.reason_for_recall || 'N/A',
        recallDate: item.recall_initiation_date || 'N/A',
        status: item.status || 'N/A',
        recallNumber: item.recall_number || '',
      }));
    } catch (err) {
      console.error('Error fetching recall data:', err);
      return [];
    }
  }
  