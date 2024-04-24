# Generated by Django 4.1.13 on 2024-04-24 17:26

from django.db import migrations, models
import django.db.models.deletion
import djongo.models.fields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='FoodItem',
            fields=[
                ('_id', djongo.models.fields.ObjectIdField(auto_created=True, primary_key=True, serialize=False)),
                ('food_type', models.CharField(max_length=100)),
                ('food_name', models.CharField(max_length=100)),
                ('food_description', models.TextField(blank=True, null=True)),
                ('food_price', models.DecimalField(decimal_places=2, max_digits=10)),
            ],
        ),
        migrations.CreateModel(
            name='Order',
            fields=[
                ('_id', djongo.models.fields.ObjectIdField(auto_created=True, primary_key=True, serialize=False)),
                ('order_date', models.DateTimeField(auto_now_add=True)),
                ('order_status', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='Person',
            fields=[
                ('_id', djongo.models.fields.ObjectIdField(auto_created=True, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100)),
                ('age', models.IntegerField()),
                ('email', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='Table',
            fields=[
                ('_id', djongo.models.fields.ObjectIdField(auto_created=True, primary_key=True, serialize=False)),
                ('table_number', models.IntegerField(unique=True)),
                ('table_status', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='Restaurant',
            fields=[
                ('_id', djongo.models.fields.ObjectIdField(auto_created=True, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255)),
                ('address', models.CharField(max_length=255)),
                ('phone_number', models.CharField(max_length=20)),
                ('website', models.URLField(blank=True, null=True)),
                ('menu_items', models.ManyToManyField(related_name='restaurants', to='menuPage.fooditem')),
                ('tables', models.ManyToManyField(related_name='restaurants', to='menuPage.table')),
            ],
        ),
        migrations.CreateModel(
            name='OrderItem',
            fields=[
                ('_id', djongo.models.fields.ObjectIdField(auto_created=True, primary_key=True, serialize=False)),
                ('quantity', models.IntegerField()),
                ('order_status', models.BooleanField(default=False)),
                ('food_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='menuPage.fooditem')),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='order_items', to='menuPage.order')),
            ],
        ),
    ]
