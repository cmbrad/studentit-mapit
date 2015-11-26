name = 'Architecture'
library = Library.create(site: Site.where(bookit_name: name).first, name: name)
Level.create(library: library, name: 'B', order: 0)
Level.create(library: library, name: 'G', order: 1)

name = 'Baillieu'
library = Library.create(site: Site.where(bookit_name: name).first, name: name)
Level.create(library: library, name: 'LG', order: 0)
Level.create(library: library, name: 'G', order: 1)
Level.create(library: library, name: '1', order: 2)
Level.create(library: library, name: '2', order: 3)

name = 'Brownless'
library = Library.create(site: Site.where(bookit_name: name).first, name: name)
Level.create(library: library, name: 'G', order: 0)
Level.create(library: library, name: '1', order: 1)
Level.create(library: library, name: '2', order: 2)

name = 'ERC'
library = Library.create(site: Site.where(bookit_name: name).first, name: name)
Level.create(library: library, name: '1', order: 0)
Level.create(library: library, name: '2', order: 1)
Level.create(library: library, name: '3', order: 2)
Level.create(library: library, name: '4', order: 3)
Level.create(library: library, name: '5', order: 4)

name = 'Giblin Eunson'
library = Library.create(site: Site.where(bookit_name: name).first, name: name)
Level.create(library: library, name: 'G', order: 0)
Level.create(library: library, name: 'UG', order: 1)
Level.create(library: library, name: '1', order: 2)

name = 'Law'
library = Library.create(site: Site.where(bookit_name: name).first, name: name)
Level.create(library: library, name: '4', order: 0)
Level.create(library: library, name: '5', order: 1)

name = 'Lenton Parr'
library = Library.create(site: Site.where(bookit_name: name).first, name: name)
Level.create(library: library, name: '1', order: 0)
