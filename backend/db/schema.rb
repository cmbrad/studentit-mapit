# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20151126084738) do

  create_table "categories", force: :cascade do |t|
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "levels", force: :cascade do |t|
    t.integer  "library_id"
    t.string   "name"
    t.integer  "order"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "levels", ["library_id"], name: "index_levels_on_library_id"

  create_table "libraries", force: :cascade do |t|
    t.integer  "site_id"
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "libraries", ["site_id"], name: "index_libraries_on_site_id"

  create_table "locations", force: :cascade do |t|
    t.string   "bookit_id"
    t.string   "bookit_name"
    t.integer  "site_id"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  add_index "locations", ["site_id"], name: "index_locations_on_site_id"

  create_table "map_coordinates", force: :cascade do |t|
    t.integer  "resource_id"
    t.integer  "x"
    t.integer  "y"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  add_index "map_coordinates", ["resource_id"], name: "index_map_coordinates_on_resource_id"

  create_table "maps", force: :cascade do |t|
    t.integer  "level_id"
    t.string   "filename"
    t.string   "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "maps", ["level_id"], name: "index_maps_on_level_id"

  create_table "resources", force: :cascade do |t|
    t.string   "bookit_id"
    t.string   "bookit_name"
    t.integer  "location_id"
    t.integer  "category_id"
    t.integer  "level_id"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

  add_index "resources", ["category_id"], name: "index_resources_on_category_id"
  add_index "resources", ["level_id"], name: "index_resources_on_level_id"
  add_index "resources", ["location_id"], name: "index_resources_on_location_id"

  create_table "sites", force: :cascade do |t|
    t.string   "bookit_id"
    t.string   "bookit_name"
    t.datetime "created_at",  null: false
    t.datetime "updated_at",  null: false
  end

end
