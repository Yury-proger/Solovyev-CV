import json
import pandas as pd
import numpy as np

# Извлекаем ключевые данные из исследования для создания интерактивной инфографики

# Создаем данные для инфографики на основе статьи
research_data = {
    "title": "Анализ эффективности коррозионной защиты трубопроводов: от CFD-моделирования до практических рекомендаций",
    
    # Режимы работы УРД и соответствующие касательные напряжения
    "urd_modes": [
        {
            "mode": "10% открытие УРД",
            "shear_stress": 40.72,  # КНнС, Па (95-й процентиль)
            "max_shear_stress": 57.48,
            "mean_shear_stress": 34.22,
            "status": "критический",
            "description": "При данном режиме ни один из испытанных ингибиторов не обеспечивает требуемую защиту"
        },
        {
            "mode": "100% открытие УРД",
            "shear_stress": 22.86,  # КНнС, Па (95-й процентиль) 
            "max_shear_stress": 34.43,
            "mean_shear_stress": 20.39,
            "status": "условно допустимый",
            "description": "Ингибитор 2 обеспечивает защиту на большей части поверхности"
        }
    ],
    
    # Критические пороги для ингибиторов
    "inhibitor_thresholds": [
        {
            "name": "Ингибитор 1",
            "threshold": 6.12,  # КНнС, Па - порог срыва пленки
            "description": "Теряет защитные свойства при КНнС > 6.12 Па"
        },
        {
            "name": "Ингибитор 2", 
            "threshold": 25.48,  # КНнС, Па - порог срыва пленки
            "description": "Более устойчив - теряет защитные свойства при КНнС > 25.48 Па"
        }
    ],
    
    # Результаты автоклавных испытаний (1380+ точек данных)
    "autoclave_results": [
        {
            "rpm": 60,
            "shear_stress": 1.52,
            "corrosion_rate_background": 1.104,
            "corrosion_rate_inhibitor1": 0.032,
            "corrosion_rate_inhibitor2": 0.041,
            "efficiency_inhibitor1": 97.1,
            "efficiency_inhibitor2": 96.3
        },
        {
            "rpm": 400,
            "shear_stress": 6.12,
            "corrosion_rate_background": 2.436,
            "corrosion_rate_inhibitor1": 0.053,
            "corrosion_rate_inhibitor2": 0.045,
            "efficiency_inhibitor1": 97.8,
            "efficiency_inhibitor2": 98.1
        },
        {
            "rpm": 800,
            "shear_stress": 15.32,
            "corrosion_rate_background": 2.970,
            "corrosion_rate_inhibitor1": 0.133,
            "corrosion_rate_inhibitor2": 0.067,
            "efficiency_inhibitor1": 95.5,
            "efficiency_inhibitor2": 97.7
        },
        {
            "rpm": 1200,
            "shear_stress": 25.48,
            "corrosion_rate_background": 2.842,
            "corrosion_rate_inhibitor1": 0.279,
            "corrosion_rate_inhibitor2": 0.093,
            "efficiency_inhibitor1": 90.8,
            "efficiency_inhibitor2": 96.9
        },
        {
            "rpm": 1700,
            "shear_stress": 38.62,
            "corrosion_rate_background": 3.020,
            "corrosion_rate_inhibitor1": 1.721,
            "corrosion_rate_inhibitor2": 0.894,
            "efficiency_inhibitor1": 9.4,
            "efficiency_inhibitor2": 53.0
        }
    ],
    
    # Ключевые результаты и метрики
    "key_metrics": {
        "data_points_analyzed": 1380,  # точек анализа поверхности купона
        "statistical_method": "95-й процентиль",
        "corrosion_rate_threshold": 0.1,  # мм/год - предельная скорость коррозии
        "efficiency_threshold": 85,  # % - минимальная защитная эффективность
        "metal_fund_losses": 12,  # % в год от общей массы металлофонда в РФ
        "cost_reduction_potential": "70-85%"  # снижение коррозионных потерь
    },
    
    # Практические рекомендации
    "recommendations": [
        "Предпочтительный режим - полностью открытый УРД (100%)",
        "Использование ингибитора 2 вместо ингибитора 1",
        "Коррозионностойкое исполнение участка трубопровода после УРД",
        "Дополнительная диагностика в зонах повышенных КНнС"
    ]
}

# Сохраняем в JSON для использования в инфографике
with open('infographic_data.json', 'w', encoding='utf-8') as f:
    json.dump(research_data, f, ensure_ascii=False, indent=2)

print("Данные для интерактивной инфографики подготовлены")
print("\nКлючевые метрики исследования:")
print(f"- Анализировано точек данных: {research_data['key_metrics']['data_points_analyzed']}")
print(f"- Критический порог КНнС для Ингибитора 1: {research_data['inhibitor_thresholds'][0]['threshold']} Па")
print(f"- Критический порог КНнС для Ингибитора 2: {research_data['inhibitor_thresholds'][1]['threshold']} Па")
print(f"- КНнС при 10% открытии УРД: {research_data['urd_modes'][0]['shear_stress']} Па")
print(f"- КНнС при 100% открытии УРД: {research_data['urd_modes'][1]['shear_stress']} Па")

# Создаем CSV с результатами автоклавных испытаний
df_autoclave = pd.DataFrame(research_data['autoclave_results'])
df_autoclave.to_csv('autoclave_test_results.csv', index=False, encoding='utf-8')
print("\nДанные автоклавных испытаний сохранены в autoclave_test_results.csv")