const leads = [
	{
		email: "john.smith@acme.com",
		phoneNumber: "555-1001",
		website: "https://acme.com",
		address: "12 Market Street",
		name: "Acme Ltd"
	},
	{
		email: "john.smith@acme.com",
		phoneNumber: "",
		website: "",
		address: "",
		name: "Acme Ltd"
	},

	{
		email: "hello@brightmedia.io",
		phoneNumber: "555-1002",
		website: "https://brightmedia.io",
		address: "42 King Road",
		name: "Bright Media"
	},

	{
		email: "sales@northwind.com",
		phoneNumber: "",
		website: "https://northwind.com",
		address: "",
		name: "Northwind"
	},
	{
		email: "sales@northwind.com",
		phoneNumber: "555-1003",
		website: "https://northwind.com",
		address: "88 North Avenue",
		name: "Northwind"
	},

	{
		email: "info@evergreen.co",
		phoneNumber: "555-1004",
		website: "",
		address: "",
		name: "Evergreen Co"
	},

	{
		email: "",
		phoneNumber: "555-1005",
		website: "https://skyline.dev",
		address: "15 River Lane",
		name: "Skyline Dev"
	},
	{
		email: "contact@skyline.dev",
		phoneNumber: "555-1005",
		website: "https://skyline.dev",
		address: "15 River Lane",
		name: "Skyline Dev"
	},

	{
		email: "hello@oceanic.io",
		phoneNumber: "555-1006",
		website: "https://oceanic.io",
		address: "22 Beach Drive",
		name: "Oceanic"
	},

	{
		email: "support@redfox.ai",
		phoneNumber: "",
		website: "",
		address: "",
		name: "RedFox AI"
	},
	{
		email: "support@redfox.ai",
		phoneNumber: "555-1007",
		website: "https://redfox.ai",
		address: "7 Innovation Park",
		name: "RedFox AI"
	},

	{
		email: "info@peaktech.com",
		phoneNumber: "555-1008",
		website: "https://peaktech.com",
		address: "91 Hill Street",
		name: "PeakTech"
	},

	{
		email: "contact@lighthouse.io",
		phoneNumber: "555-1009",
		website: "https://lighthouse.io",
		address: "5 Harbour Road",
		name: "Lighthouse"
	},

	{
		email: "team@alpha.co",
		phoneNumber: "",
		website: "",
		address: "",
		name: "Alpha Co"
	},
	{
		email: "team@alpha.co",
		phoneNumber: "",
		website: "https://alpha.co",
		address: "",
		name: "Alpha Co"
	},

	{
		email: "info@greenleaf.org",
		phoneNumber: "555-1010",
		website: "",
		address: "4 Forest Lane",
		name: "GreenLeaf"
	},

	{
		email: "contact@fusionlabs.dev",
		phoneNumber: "555-1011",
		website: "https://fusionlabs.dev",
		address: "77 Science Way",
		name: "Fusion Labs"
	},

	{
		email: "admin@stoneworks.com",
		phoneNumber: "555-1012",
		website: "https://stoneworks.com",
		address: "3 Quarry Road",
		name: "StoneWorks"
	},
	{
		email: "",
		phoneNumber: "555-1012",
		website: "",
		address: "",
		name: "StoneWorks"
	},

	{
		email: "info@horizongroup.com",
		phoneNumber: "555-1013",
		website: "https://horizongroup.com",
		address: "19 Sunset Blvd",
		name: "Horizon Group"
	},

	{
		email: "sales@vertexdigital.com",
		phoneNumber: "",
		website: "",
		address: "",
		name: "Vertex Digital"
	},
	{
		email: "sales@vertexdigital.com",
		phoneNumber: "555-1014",
		website: "https://vertexdigital.com",
		address: "54 Business Park",
		name: "Vertex Digital"
	},

	{
		email: "hello@bluebird.io",
		phoneNumber: "555-1015",
		website: "https://bluebird.io",
		address: "11 Lake View",
		name: "Bluebird"
	},

	{
		email: "info@pioneer.tech",
		phoneNumber: "555-1016",
		website: "https://pioneer.tech",
		address: "101 Pioneer Way",
		name: "Pioneer Tech"
	},

	{
		email: "support@cascade.ai",
		phoneNumber: "555-1017",
		website: "",
		address: "",
		name: "Cascade AI"
	},
	{
		email: "",
		phoneNumber: "555-1017",
		website: "https://cascade.ai",
		address: "9 Waterfall Road",
		name: "Cascade AI"
	},

	{
		email: "contact@sunriseenergy.com",
		phoneNumber: "555-1018",
		website: "https://sunriseenergy.com",
		address: "1 Solar Park",
		name: "Sunrise Energy"
	},

	{
		email: "office@quantix.io",
		phoneNumber: "555-1019",
		website: "https://quantix.io",
		address: "25 Quantum Avenue",
		name: "Quantix"
	},

	{
		email: "hello@atlaslogistics.com",
		phoneNumber: "555-1020",
		website: "https://atlaslogistics.com",
		address: "64 Freight Street",
		name: "Atlas Logistics"
	},

	{
		email: "",
		phoneNumber: "",
		website: "",
		address: "",
		name: "Acme Ltd"
	}
];

function findOccurrences (lead) {
	return leads.filter(l => 
		(l.phoneNumber && l.phoneNumber == lead.phoneNumber) ||
		(l.email && l.email == lead.email) ||
		(l.website && l.website == lead.website)
	)
}

function combineLead (options) {
	let finalLead = {
		website: "",
		name: "",
		address: "",
		phoneNumber: "",
		email: ""
	};
	
	options.forEach(lead => {
		Object.keys(lead).map(key => {
			if (finalLead[key] == "" && lead[key] !== "") {
				finalLead[key] = lead[key];
			} 
		})
	})
	
	return finalLead;
}

function removeLeadDuplicates () {
	const newFreshLeads = [];
	
	for (let i = 0; i < leads.length; i++) {
		if (newFreshLeads.filter(lead => (
			Object.keys(lead).filter(key => (lead[key] == leads[i][key])).length > 0
		)).length > 0) {
			// if the index should be skipped move to the next lead
			continue;
		} else {
			const occurrences = findOccurrences(leads[i]);
			if (occurrences.length > 1) {
				newFreshLeads.push(combineLead(occurrences));
			} else {
				newFreshLeads.push(leads[i]);
			}
		}
	}
	
	console.log(newFreshLeads.length)
	// console.log(newFreshLeads)
}

removeLeadDuplicates();