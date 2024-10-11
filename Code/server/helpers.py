import os
import pandas as pd
import requests
import json
from dotenv import load_dotenv

load_dotenv()

column_names = ['uid', 'machineId', 'productID',"type","airTemperature","processTemperature","rotationalSpeed","torque","toolWear","predictedFailure","confidence"]

def read_machine_data():
    df = pd.read_csv('machine_data.csv', names=column_names, header=0)
    machine_data = df.to_dict(orient='records')
    return machine_data

def predict_failure_local(saved_model,machine_data):
    model = saved_model['model']
    ct = saved_model['column_transformer']

    input_data = pd.DataFrame({
        'Type': [machine_data.type],
        'Air temperature [K]': [machine_data.air_temperature],
        'Process temperature [K]': [machine_data.process_temperature],
        'Rotational speed [rpm]': [machine_data.rotational_speed],
        'Torque [Nm]': [machine_data.torque],
        'Tool wear [min]': [machine_data.tool_wear]
    })

    transformed_input = ct.transform(input_data)
    prediction = model.predict(transformed_input)
    prediction_proba = model.predict_proba(transformed_input)
    failure_proba = prediction_proba[0][1]

    return bool(prediction[0]),failure_proba

def predict_failure(machine_data):
    url = os.getenv("API_URL")
    headers = {
        'Content-Type': 'application/json',
        'Authorization': os.getenv("API_KEY")
    }
    data = {
        'data' : {
            'Type': [machine_data.type],
            'Air temperature [K]': [machine_data.air_temperature],
            'Process temperature [K]': [machine_data.process_temperature],
            'Rotational speed [rpm]': [machine_data.rotational_speed],
            'Torque [Nm]': [machine_data.torque],
            'Tool wear [min]': [machine_data.tool_wear]
        }  
    }
    response = requests.post(url, json=data, headers=headers)
    if response.status_code != 200: 
        print("couldnt reach api"+str(response.text))
        return
    response = json.loads(response.json())
    response = response["result"]
    return bool(response["class"][0]),max(response["confidence"][0])
    