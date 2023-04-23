const express = require('express');
const router = express.Router();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json()
const business_data = [];
const review_data = [];
const photo_data = [];
let business_count = 0;
let review_count = 0;
let photo_count = 0;

// GET all businesses
router.get('/', function(req, res, next) {
    console.log(req.query.page)
    if(req.query.page){
        if (req.query.page <= business_count && req.query.page >= 0){
            const next_page = parseInt(req.query.page)+1
            const previous_page = parseInt(req.query.page)-1
            full_data =
            {
                "page_number": `${req.query.page}`,
                "total_pages": `${business_count}`,
                "page_size": "1",
                "total_count": `${business_data[req.query.page]}`, 
                "links": {
                    "next_page": `/businesses?page=${next_page}`,
                    "previous_page": `/businesses?page=${previous_page}`
                }
            }
        }
        else
            res.status(204).json({"content": "empty"})
    }
    else {
        full_data =
        {
            "total_pages": `${business_count}`,
            "page_size": "1",
            "total_count": `${business_data.length}`, 
            "links": {
                "first_page": `/businesses?page=1`,
            }
        }
    }
    res.status(200).json(full_data);
});

// GET specific business
router.get('/:businessID', function(req, res, next) {
    const id = req.params.businessID;
    console.log("id is: ", req.params)
    const full_data = [business_data[id]]
    if (id >= 0 && id < business_data.length){
        // get relevant reviews
        for(let i = 0; i < review_data.length; i++){
            console.log(review_data[i])
            if (review_data[i].business_id == id)
                
                full_data.push(review_data[i])
        }
        // get relevant photos
        for(let i = 0; i < photo_data.length; i++){
            console.log(photo_data[i])
            if (photo_data[i].business_id == id)
                
                full_data.push(photo_data[i])
        }
    res.json(full_data);
}
    else
        res.status(400).json({"error": "id out of range"})
});

// POST new review or photo for specific business
router.post('/:businessID/addReview', function(req, res, next) {
    const id = req.params.businessID
    const review_id = review_count;
    if (id >= 0 && id < business_data.length){
        if (!req.body.star_rating) {
            res.status(400).json({"error": "reviews need a star rating"})
        } 
        else if(!req.body.doller_sign) {
            res.status(400).json({"error": "reviews need a price ratings"})
        }
        else {
            review_count++;;
            req.body.business_id = id
            req.body.id = review_id
            review_data[review_id] = req.body
            console.log("adding review: ", req.body, "to", review_data)
            res.json({
                "status": "ok", 
                "id": review_id
            });
        }
    }
    else 
        res.status(400).json({"error": "id out of range"})
    
});

// POST new photo for specific business
router.post('/:businessID/addPhoto', function(req, res, next) {
    const id = req.params.businessID
    const photo_id = photo_count;
    if (id >= 0 && id < business_data.length){
        if (!req.body.photoURL) {
            res.status(400).json({"error": "photos need a url"})
        } 
        else {
            photo_count++;
            req.body.business_id = id
            req.body.id = photo_id
            photo_data[photo_id] = req.body
            console.log("adding photo: ", req.body, "to", photo_data)
            res.json({
                "status": "ok", 
                "id": photo_id
            });
        }
    }
    else
        res.status(400).json({"error": "id out of range"})
});

// POST new business
router.post('/', jsonParser, function(req, res, next) {
    const id = business_count;
    if (!req.body.name) { 
        res.status(400).json({"error": "name required"});
    }
    else if (!req.body.street_address) {
        res.status(400).json({"error": "street address required"});
    }
    else if (!req.body.city) {
        res.status(400).json({"error": "city required"});
    }
    else if (!req.body.state) {
        res.status(400).json({"error": "state required"});
    }
    else if (!req.body.zip_code) {
        res.status(400).json({"error": "ZIP code required"});
    }
    else if (!req.body.phone_number) {
        res.status(400).json({"error": "phone number required"});
    }
    else if (!req.body.category) {
        res.status(400).json({"error": "category required"});
    }
    else {
        business_count++;
        req.body.id = id;
        review_data[id] = [];
        photo_data[id] = [];
        req.body.links = {
            "view": `/businesses/${id}`,
        }
        business_data.push(req.body);
        console.log("adding business: ", req.body)
        res.json({
            "status": "ok", 
            "id": id
        });
    }

});

// PUT exisiting business
router.put('/:businessID', function(req, res, next) {
    const id = req.params.businessID
    console.log("modifying business with id ", id)
    if (id >= 0 && id < business_data.length){
        req.body.id = id;
        business_data[id] = req.body
        res.json({
            "status": "ok", 
            "id": id
        });
    }
    else
        res.status(400).json({"error": "id out of range"})
});

// PUT existing review
router.put('/reviews/:reviewID', function(req, res, next) {
    const id = req.params.reviewID
    console.log("modifying review with id ", id)
    if (id >= 0 && id < business_data.length){
        req.body.id = id;
        review_data[id] = req.body
        res.json({
            "status": "ok", 
            "id": id
        });
    }
    else 
        res.status(400).json({"error": "id out of range"})
});

// PUT existing photo
router.put('/photos/:photoID', function(req, res, next) {
    const id = req.params.photoID
    console.log("modifying photo with id ", id)
    if (id >= 0 && id < business_data.length){
        req.body.id = id;
        photo_data[id] = req.body
        res.json({
            "status": "ok", 
            "id": id
        });
    }
    else
        res.status(400).json({"error": "id out of range"})
});

// DELETE existing business
router.delete('/:businessID', function(req, res, next) {
    id = req.params.businessID
    console.log("deleting business with id", id)
    business_data[id] = "deleted"
    res.json({
        "status": "deleted",
        "id": id
    })
})

// DELETE existing review
router.delete('/reviews/:reviewID', function(req, res, next) {
    id = req.params.reviewID
    console.log("deleting review with id", id)
    review_data[id] = "deleted"
    res.json({
        "status": "deleted",
        "id": id
    })
})

// DELETE existing photo
router.delete('/photos/:photoID', function(req, res, next) {
    id = req.params.photoID
    console.log("deleting photo with id", id)
    photo_data[id] = "deleted"
    res.json({
        "status": "deleted",
        "id": id
    })
})


module.exports = router;