namespace :bookit do
  require 'json'
  require 'open-uri'

  # BookIT API URL - Gives us all the data!
  @url = "https://bookit.unimelb.edu.au/MyPC/Front.aspx?page=getResourceStatesAPI"

  desc "Download ID and name data about all sites/locations/resources from the bookit API
        and saves it into our database."
  task import: :environment do
    # Download the data from bookit
    sites = JSON.load(open(@url))
    # Data is a list of sites
    sites.each do |s|
      site = Site.create(bookit_id: s['id'], bookit_name: s['name'])
      # Each site has a list of locations
      locations = s['locations']
      
      locations.each do |l|
        location = Location.create(site: site, bookit_id: l['id'], bookit_name: l['name'])
        # Each location has a list of resources
        resources = l['resources']

        resources.each do |r|
          Resource.create(location: location, bookit_id: r['id'], bookit_name: r['name'])
        end
      end
    end
  end
end
