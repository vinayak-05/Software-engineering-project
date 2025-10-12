import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.preprocessing import OneHotEncoder
import joblib
import os
import sys

def train_and_save_model():
    # Load dataset
    df = pd.read_csv('prices.csv')

    # Convert date
    df['Price Date'] = pd.to_datetime(df['Price Date'])

    # Get unique crops
    crops = df['Variety'].unique()

    for crop in crops:
        crop_df = df[df['Variety'] == crop].copy()

        if crop_df.empty:
            continue

        # Create daily average prices per crop
        daily_avg = crop_df.groupby('Price Date')['Capped Price'].mean().reset_index()
        daily_avg.columns = ['Date', 'Price']

        # One-hot encode District Name
        districts = crop_df.groupby('Price Date')['District Name'].first().reset_index().rename(columns={'Price Date': 'Date'})
        daily_avg = daily_avg.merge(districts, on='Date', how='left')
        encoder = OneHotEncoder(sparse_output=False, handle_unknown='ignore')
        district_encoded = encoder.fit_transform(daily_avg[['District Name']])
        district_cols = [f'District_{cat}' for cat in encoder.categories_[0]]
        district_df = pd.DataFrame(district_encoded, columns=district_cols)
        daily_avg = pd.concat([daily_avg, district_df], axis=1)

        # Create features
        daily_data = daily_avg.copy()
        daily_data['Day'] = daily_data['Date'].dt.day
        daily_data['Month'] = daily_data['Date'].dt.month
        daily_data['Year'] = daily_data['Date'].dt.year
        daily_data['DayOfWeek'] = daily_data['Date'].dt.dayofweek
        daily_data['DayNumber'] = range(len(daily_data))

        # Enhanced features
        daily_data['Price_lag1'] = daily_data['Price'].shift(1)
        daily_data['Price_lag7'] = daily_data['Price'].shift(7)
        daily_data['MA_7'] = daily_data['Price'].rolling(window=7).mean()
        daily_data['MA_14'] = daily_data['Price'].rolling(window=14).mean()
        daily_data['Price_change'] = daily_data['Price'].diff()
        daily_data['Price_pct_change'] = daily_data['Price'].pct_change()
        daily_data['Quarter'] = daily_data['Date'].dt.quarter
        daily_data['WeekOfYear'] = daily_data['Date'].dt.isocalendar().week
        daily_data['IsWeekend'] = daily_data['DayOfWeek'].isin([5, 6]).astype(int)

        # Drop NaN
        daily_data = daily_data.dropna()

        if daily_data.empty:
            continue

        # Features and target
        feature_columns = ['Day', 'Month', 'Year', 'DayOfWeek', 'DayNumber',
                           'Price_lag1', 'Price_lag7', 'MA_7', 'MA_14',
                           'Price_change', 'Price_pct_change', 'Quarter',
                           'WeekOfYear', 'IsWeekend'] + district_cols
        X = daily_data[feature_columns]
        y = daily_data['Price']

        # Train model
        model = RandomForestRegressor(n_estimators=100, random_state=42)
        model.fit(X, y)

        # Save model and encoder
        safe_crop = crop.replace("/", "_").replace(" ", "_")
        joblib.dump(model, f'crop_price_model_{safe_crop}.pkl')
        joblib.dump(encoder, f'encoder_{safe_crop}.pkl')
        print(f"Model for {crop} trained and saved")

def predict_price(crop, location):
    print(f"Starting prediction for {crop} in {location}", file=sys.stderr)

    # Load dataset to check if crop exists
    df = pd.read_csv('prices.csv')
    df['Price Date'] = pd.to_datetime(df['Price Date'])
    unique_crops = df['Variety'].unique()
    if crop not in unique_crops:
        print("0.00")  # invalid crop
        return

    safe_crop = crop.replace("/", "_").replace(" ", "_")
    model_path = f'crop_price_model_{safe_crop}.pkl'
    encoder_path = f'encoder_{safe_crop}.pkl'

    if not os.path.exists(model_path):
        print("Model not found, training...", file=sys.stderr)
        train_and_save_model()
        if not os.path.exists(model_path):
            print("0.00")  # fallback
            return

    # Load model and encoder
    print("Loading model and encoder", file=sys.stderr)
    model = joblib.load(model_path)
    encoder = joblib.load(encoder_path)

    # Load dataset
    print("Loading CSV", file=sys.stderr)
    df = pd.read_csv('prices.csv')
    df['Price Date'] = pd.to_datetime(df['Price Date'])

    # Filter by crop and location
    print("Filtering data", file=sys.stderr)
    filtered_df = df[(df['Variety'] == crop) & (df['District Name'] == location)]

    if filtered_df.empty:
        # Fallback to crop only
        filtered_df = df[df['Variety'] == crop]
        if filtered_df.empty:
            print("0.00")
            return

    print(f"Filtered data has {len(filtered_df)} rows", file=sys.stderr)

    # Create daily average prices
    print("Creating daily averages", file=sys.stderr)
    daily_avg = filtered_df.groupby('Price Date')['Capped Price'].mean().reset_index()
    daily_avg.columns = ['Date', 'Price']

    # One-hot encode District Name
    districts = filtered_df.groupby('Price Date')['District Name'].first().reset_index().rename(columns={'Price Date': 'Date'})
    daily_avg = daily_avg.merge(districts, on='Date', how='left')
    district_encoded = encoder.transform(daily_avg[['District Name']])
    district_cols = [f'District_{cat}' for cat in encoder.categories_[0]]
    district_df = pd.DataFrame(district_encoded, columns=district_cols)
    daily_avg = pd.concat([daily_avg, district_df], axis=1)

    # Create features
    print("Creating features", file=sys.stderr)
    daily_data = daily_avg.copy()
    daily_data['Day'] = daily_data['Date'].dt.day
    daily_data['Month'] = daily_data['Date'].dt.month
    daily_data['Year'] = daily_data['Date'].dt.year
    daily_data['DayOfWeek'] = daily_data['Date'].dt.dayofweek
    daily_data['DayNumber'] = range(len(daily_data))

    # Enhanced features
    daily_data['Price_lag1'] = daily_data['Price'].shift(1)
    daily_data['Price_lag7'] = daily_data['Price'].shift(7)
    daily_data['MA_7'] = daily_data['Price'].rolling(window=7).mean()
    daily_data['MA_14'] = daily_data['Price'].rolling(window=14).mean()
    daily_data['Price_change'] = daily_data['Price'].diff()
    daily_data['Price_pct_change'] = daily_data['Price'].pct_change()
    daily_data['Quarter'] = daily_data['Date'].dt.quarter
    daily_data['WeekOfYear'] = daily_data['Date'].dt.isocalendar().week
    daily_data['IsWeekend'] = daily_data['DayOfWeek'].isin([5, 6]).astype(int)

    # Drop NaN
    daily_data = daily_data.dropna()

    if daily_data.empty:
        print("0.00")
        return

    print(f"Daily data has {len(daily_data)} rows", file=sys.stderr)

    # Get last row's features
    last_row = daily_data.iloc[-1]
    last_date = last_row['Date']

    # Predict for tomorrow
    from datetime import timedelta
    tomorrow = last_date + timedelta(days=1)

    features = {
        'Day': tomorrow.day,
        'Month': tomorrow.month,
        'Year': tomorrow.year,
        'DayOfWeek': tomorrow.weekday(),
        'DayNumber': last_row['DayNumber'] + 1,
        'Price_lag1': last_row['Price'],  # today's price as lag1 for tomorrow
        'Price_lag7': daily_data.iloc[-7]['Price'] if len(daily_data) > 7 else last_row['Price'],
        'MA_7': daily_data['Price'].tail(7).mean(),
        'MA_14': daily_data['Price'].tail(14).mean() if len(daily_data) >= 14 else daily_data['Price'].mean(),
        'Price_change': last_row['Price'] - (daily_data.iloc[-2]['Price'] if len(daily_data) > 1 else 0),
        'Price_pct_change': (last_row['Price'] - (daily_data.iloc[-2]['Price'] if len(daily_data) > 1 else last_row['Price'])) / (daily_data.iloc[-2]['Price'] if len(daily_data) > 1 else last_row['Price']),
        'Quarter': (tomorrow.month - 1) // 3 + 1,
        'WeekOfYear': tomorrow.isocalendar().week,
        'IsWeekend': 1 if tomorrow.weekday() >= 5 else 0
    }

    # Add district encoding for the location
    district_encoded_pred = encoder.transform([[location]])
    for i, col in enumerate(district_cols):
        features[col] = district_encoded_pred[0][i]

    print("Predicting", file=sys.stderr)
    X_pred = pd.DataFrame([features])
    prediction = model.predict(X_pred)[0]
    print(f"{prediction:.2f}")

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "predict":
        if len(sys.argv) < 4:
            print("Usage: python price_predictor.py predict <crop> <location>")
            sys.exit(1)
        crop = sys.argv[2]
        location = sys.argv[3]
        predict_price(crop, location)
    else:
        train_and_save_model()
