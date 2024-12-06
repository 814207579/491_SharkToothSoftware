from pymongo import MongoClient
from pymongo.errors import OperationFailure
import win32print

def print_receipt(order, table_number):
    PRINTER = "POS-80C"  # Adjust to your printer's name
    CUT_PAPER = b'\x1D\x56\x42\x00'  # ESC/POS command to cut the paper
    LINE_FEED = b'\n'  # Line feed to move to the next line

    # Prepare the receipt text
    order_text = (f"Hello, welcome to our restaurant!\n"
                  f"Thank you for visiting.\n\n"
                  f"Table Number: {table_number}\n"
                  "Here is your order:\n\n")

    total_price = 0.0
    for item in order["items"]:
        food_name = item["food_item_name"]
        food_price = float(item["food_item_price"])
        quantity = item["quantity"]
        item_total = food_price * quantity
        total_price += item_total
        order_text += f"{quantity}x {food_name} - ${item_total:.2f}\n"

    order_text += ("\n"
                   f"Total: ${total_price:.2f}\n"
                   "---------------------\n"
                   "Enjoy your meal!\n")

    print(order_text)

    formatted_text = order_text.encode('utf-8') + LINE_FEED * 3

    hPrinter = win32print.OpenPrinter(PRINTER)
    try:
        hJob = win32print.StartDocPrinter(hPrinter, 1, ("Receipt", None, "RAW"))
        win32print.StartPagePrinter(hPrinter)
        win32print.WritePrinter(hPrinter, formatted_text)
        win32print.WritePrinter(hPrinter, CUT_PAPER)
        win32print.EndPagePrinter(hPrinter)
        win32print.EndDocPrinter(hPrinter)
    finally:
        win32print.ClosePrinter(hPrinter)

def watch_collection(uri, database_name, collection_name):
    client = MongoClient(uri)
    db = client[database_name]
    collection = db[collection_name]
    tables_collection = db["menuPage_table"]

    try:
        print(f"Watching for new orders in '{database_name}.{collection_name}'...")
        with collection.watch() as stream:
            for change in stream:
                if change["operationType"] == "insert":
                    order = change["fullDocument"]
                    table_id = order.get("table")

                    try:
                        # Fetch the table number from the tables collection
                        table = tables_collection.find_one({"_id": ObjectId(table_id)})
                        table_number = table["table_number"] if table else "Unknown"
                    except Exception as e:
                        print(f"Error fetching table: {e}")
                        table_number = "Unknown"

                    print("New order detected. Printing receipt...")
                    print_receipt(order, table_number)
    except OperationFailure as e:
        print("Change Stream not supported or failed:", e)
    except Exception as e:
        print("An error occurred:", e)
    finally:
        client.close()

if __name__ == "__main__":
    # MongoDB connection URI
    uri = "mongodb+srv://Admin:Admin@cluster0.yl3tbkn.mongodb.net/"
    database_name = "restaurant_db"
    collection_name = "menuPage_order"

    # Start watching the collection
    watch_collection(uri, database_name, collection_name)
