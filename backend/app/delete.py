from sqlalchemy import delete, create_engine, MetaData

engine = create_engine("sqlite:///app.db")
metadata = MetaData()
metadata.reflect(bind=engine) # Reflect the database schema

with engine.connect() as connection:
    # Iterate over all tables and delete all rows
    for table in reversed(metadata.sorted_tables):
        print(f"Deleting all records from table: {table.name}")
        connection.execute(delete(table))
    connection.commit()
print("Database cleared (records deleted, schema preserved).")

